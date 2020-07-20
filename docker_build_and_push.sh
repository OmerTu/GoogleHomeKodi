#!/bin/bash

docker buildx build \
	--platform linux/amd64,linux/arm64,linux/s390x,linux/386,linux/arm/v7,linux/arm/v6 \
	--tag omertu/googlehomekodi:latest \
	--push .