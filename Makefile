eas-local:
	NODE_ENV=development eas build --profile development --platform android --local \
	--output easyPantry-build-$$(git rev-parse --short HEAD).apk

eas-local-preview:
	NODE_ENV=development eas build --profile preview --platform android --local \
	--output easyPantry-preview-$$(git rev-parse --short HEAD).apk

