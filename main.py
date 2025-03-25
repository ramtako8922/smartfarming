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

@app.get("/dioxido", response_class=HTMLResponse)
async def read_dioxido(request: Request):
    return templates.TemplateResponse("dioxido.html", {"request": request})

@app.get("/humedad", response_class=HTMLResponse)
async def read_nivel_humedad(request: Request):
    return templates.TemplateResponse("humedad.html", {"request": request})

@app.get("/carbono", response_class=HTMLResponse)
async def read_nivel_carbono(request: Request):
    return templates.TemplateResponse("carbono.html", {"request": request})
@app.get("/material", response_class=HTMLResponse)
async def read_material_particulado(request: Request):
    return templates.TemplateResponse("material.html", {"request": request})