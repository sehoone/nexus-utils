#!/bin/bash

# maven bulk import 
# 사용법_npm tgz파일 디렉토리에 해당 파일 복사 후 실행. 
# 1. npm login --registry http://localhost:5001/repository/npm-hosted/
# 2. ./npmimport.sh -r http://localhost:5001/repository/npm-hosted/
# Get command line params
while getopts ":r:k:" opt; do
	case $opt in
		r) REPO_URL="$OPTARG"
		;;
	esac
done

find . -type f -not -path '*/\.*' -name '*.tgz' -exec npm publish {} --registry $REPO_URL \;
