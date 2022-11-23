cd src/client
npm run build
rm -Recurse ../main/resources/assets/*
mv build/* ../main/resources/assets/
cd ../../
rm -Recurse build/*
./gradlew build