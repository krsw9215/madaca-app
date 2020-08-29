cd madaca
npm run build
npm run generate
cd ..
firebase use madaca-app
firebase deploy --only hosting
