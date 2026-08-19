eas-local:
	NODE_ENV=development eas build --profile development --platform android --local \
	--output easyPantry-build-$$(git rev-parse --short HEAD).apk