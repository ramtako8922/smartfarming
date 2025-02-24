# filepath: /d:/Maestría/smartfarming/main.py
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/temperatura", response_class=HTMLResponse)
async def read_temperatura(request: Request):
    return templates.TemplateResponse("temperatura.html", {"request": request})

@app.get("/luminosidad", response_class=HTMLResponse)
async def read_luminosidad(request: Request):
    return templates.TemplateResponse("luminosidad.html", {"request": request})

@app.get("/nivel-lluvia", response_class=HTMLResponse)
async def read_nivel_lluvia(request: Request):
    return templates.TemplateResponse("nivel_lluvia.html", {"request": request})

@app.get("/nivel-metano", response_class=HTMLResponse)
async def read_nivel_metano(request: Request):
    return templates.TemplateResponse("nivel_metano.html", {"request": request})