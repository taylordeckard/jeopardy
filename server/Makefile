REGISTRY?=warbler.docker-registry
REPO?=jprdy-server

build:
	podman build -t ${REGISTRY}/${REPO} . 
push:
	podman push --tls-verify=false ${REGISTRY}/${REPO}
