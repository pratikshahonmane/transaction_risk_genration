import pandas as pd
import pickle
import os

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier


def load_and_clean_data(file_path):

    df = pd.read_csv(file_path)

    drop_cols = [
    "transaction_id",
    "timestamp",
    "latitude",
    "longitude",
    "sender_account",
    "receiver_account",
    "sender_old_balance",
    "receiver_old_balance",
    "sender_new_balance",
    "receiver_new_balance",
    "velocity_score",
    "geo_anomaly_score",
    "fraud_type",
    "customer_occupation",
    'spending_score',
    'flagged_fraud',
    

    ]

    df.drop(columns=drop_cols, inplace=True, errors="ignore")

    num_cols = df.select_dtypes(include=["float64","int64"]).columns
    for col in num_cols:
        df[col] = df[col].fillna(df[col].median())

    cat_cols = df.select_dtypes(include=["object"]).columns
    for col in cat_cols:
        df[col] = df[col].fillna("Unknown")

    return df


def encode_and_scale(df):

    encoders = {}

    cat_cols = df.select_dtypes(include=["object"]).columns

    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    X = df.drop("fraud_label", axis=1)
    y = df["fraud_label"]

    smote = SMOTE(random_state=42)

    X_res, y_res = smote.fit_resample(X,y)

    X_train, X_test, y_train, y_test = train_test_split(
        X_res,y_res,test_size=0.2,random_state=42,stratify=y_res
    )

    scaler = StandardScaler()

    num_cols = X.select_dtypes(include=["float64","int64"]).columns

    X_train[num_cols] = scaler.fit_transform(X_train[num_cols])
    X_test[num_cols] = scaler.transform(X_test[num_cols])

    return X_train,X_test,y_train,y_test,encoders,scaler


def train_model(X_train,y_train):

    model = XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.1,
        eval_metric="logloss",
        random_state=42
    )

    model.fit(X_train,y_train)

    return model


def save_model(model,scaler,encoders,features):

    os.makedirs("model_output",exist_ok=True)

    pickle.dump(model,open("model_output/xgb_model.pkl","wb"))
    pickle.dump(scaler,open("model_output/scaler.pkl","wb"))
    pickle.dump(encoders,open("model_output/encoders.pkl","wb"))
    pickle.dump(features,open("model_output/features.pkl","wb"))


def main():

    file_path="master_dataset.csv"

    df = load_and_clean_data(file_path)

    X_train,X_test,y_train,y_test,encoders,scaler = encode_and_scale(df)

    model = train_model(X_train,y_train)

    preds = model.predict(X_test)

    print("Accuracy:",accuracy_score(y_test,preds))

    print(classification_report(y_test,preds))

    save_model(model,scaler,encoders,X_train.columns.tolist())


if __name__=="__main__":
    main()