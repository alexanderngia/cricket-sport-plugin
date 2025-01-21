cd Views/react-app && npm i && npm run build && cd ../../ && \
# sed -i '' 's|static/media|wp-content/plugins/wp-critket/Views/admin/build/static/media|g' ./Views/admin/build/static/js/*.js && \ 
mv ./Views/react-app/build/static/js/main.*.js ./Views/react-app/build/static/js/main.js && \
mv ./Views/react-app/build/static/css/main.*.css ./Views/react-app/build/static/css/main.css 