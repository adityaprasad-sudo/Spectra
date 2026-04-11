import os
import base64
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List,Optional
import dotenv
import uvicorn

dotenv.load_dotenv()

app = FastAPI(
    title = "SpectraBackend",
    description = "Eating food of your choice",
    version = "1.0.0"

)

apikey = os.getenv("OPENAI_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class mealplan(BaseModel):
    ingredients: str
    days: int
    goal: Optional[list[str]] = None

class imagereq(BaseModel):
    imagebase64: str
    imtype: str = "image/jpeg"

class barreq(BaseModel):
    barcode: str    








@app.get("/")
async def root():
    return {"message": "Lobster says its workin"}


@app.post("/meal")
async def mealplanbruh(request: mealplan):
    if not apikey:
        raise HTTPException(status_code=404, detail="API key not found")
    goalstxt = f"focus on: {', '.join(request.goal)}" if request.goal else ""
    prompt = f"""
You are a professional nutritionist.
Create a {request.days}-day meal prep plan using: {request.ingredients}.
{goalstxt}
For each day: Breakfast, Lunch, Dinner, and a Snack.
Format clearly with Day 1:, Day 2:, etc.
Keep it practical, healthy, and varied.
CRITICAL INSTRUCTION: Output ONLY the daily schedule. Do NOT include any introductory text, greetings, lists of principles, or concluding remarks. Start your response immediately with 'Day 1:'.
"""
    async with httpx.AsyncClient(timeout=None) as client:
        responce = await client.post(
            "https://ai.hackclub.com/proxy/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {apikey}"
            },
            json={
                "model": "google/gemini-2.5-flash",
                "messages": [{"role": "system", "content": "You are a professional nutritionist."}, {"role": "user", "content": prompt}],
            }

        )
        if responce.status_code != 200:
         raise HTTPException(status_code=responce.status_code, detail=responce.text)
        data = responce.json()
        mealplantxt = data["choices"][0]["message"]["content"]
        return {"mealplan": mealplantxt}

@app.post("/image")
async def image(request: imagereq):
    if not apikey:
        raise HTTPException(status_code=404, detail="API key not found")
    async with httpx.AsyncClient(timeout=None) as client:
        responce = await client.post(
        "https://ai.hackclub.com/proxy/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {apikey}"
        },
        json={
            "model": "nvidia/nemotron-nano-12b-v2-vl",
            "messages": [{"role": "user", "content":[{ "type": "text", "text": "List every food ingredient in the image. Return ONLY a comma-separated list of ingredients."}, {"type": "image_url", "image_url": {"url": f"data:{request.imtype};base64,{request.imagebase64}"}}]}]},)
        if responce.status_code != 200:
         raise HTTPException(status_code=responce.status_code, detail=responce.text)
        data = responce.json()
        ingredients = data["choices"][0]["message"]["content"]
        return {"ingredients": ingredients}
       

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


