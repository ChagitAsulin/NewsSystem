
#FROM python:3.11-slim
#WORKDIR /app
#COPY requirements.txt .
#RUN pip install -r requirements.txt
#COPY src ./src
#CMD ["python","-m","src.consume"]

FROM python:3.11-slim

# עבודה בתיקיית /app
WORKDIR /app

# העתקת קובץ התלויות
COPY requirements.txt .

# התקנת NumPy < 2 כדי להימנע מהתנגשות
RUN pip install "numpy<2" && \
    pip install -r requirements.txt

# העתקת קוד המקור
COPY src ./src

# פקודת הרצה
CMD ["python","-m","src.consume"]

