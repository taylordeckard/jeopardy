REGISTRY?=warbler.docker-registry
REPO?=jprdy-nginx

build:
	podman build -t ${REGISTRY}/${REPO} . 
push:
	podman push --tls-verify=false ${REGISTRY}/${REPO}
