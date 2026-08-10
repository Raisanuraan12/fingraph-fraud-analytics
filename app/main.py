from fastapi import FastAPI

app = FastAPI(title="FinGraph API")

@app.get("/")
def root():
    return {"message": "FinGraph Backend Running"}

@app.get("/health")
def health():
    return {"status": "ok"}