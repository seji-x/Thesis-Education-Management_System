FROM python:3.10
ENV APPLICATION_SERVICE=/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    bzip2 \
    libgl1-mesa-glx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Miniconda
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh && \
    /bin/bash /tmp/miniconda.sh -b -p /opt/conda && \
    rm /tmp/miniconda.sh && \
    /opt/conda/bin/conda clean -a -y

ENV PATH /opt/conda/bin:$PATH

# Create a conda environment and install GDAL
RUN conda create -n gdal_env -c conda-forge python=3.10 gdal=3.9 -y

# Set the environment to use the new conda environment
ENV CONDA_DEFAULT_ENV=gdal_env
ENV PATH=/opt/conda/envs/gdal_env/bin:$PATH
ENV LD_LIBRARY_PATH=/opt/conda/envs/gdal_env/lib:$LD_LIBRARY_PATH

# Create symbolic links to system library path
RUN ln -s /opt/conda/envs/gdal_env/lib/libgdal.so /usr/lib/libgdal.so && \
    ln -s /opt/conda/envs/gdal_env/lib/libgdal.so.29 /usr/lib/libgdal.so.29

# Set work directory
RUN mkdir -p $APPLICATION_SERVICE

# Where the code lives
WORKDIR $APPLICATION_SERVICE

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install Poetry
COPY poetry.lock pyproject.toml ./
RUN pip install poetry

# Configure Poetry
RUN poetry config virtualenvs.create false

# Manually install setuptools before running Poetry
RUN conda run -n gdal_env pip install setuptools==75.2.0

# Install project dependencies using Poetry
RUN conda run -n gdal_env poetry install --only main

# Copy project
COPY . $APPLICATION_SERVICE

# Set the working directory again
WORKDIR $APPLICATION_SERVICE

# Run the application
CMD conda run -n gdal_env python manage.py migrate && \
    conda run -n gdal_env python manage.py collectstatic --noinput && \
    conda run -n gdal_env python manage.py runserver 0.0.0.0:8000
