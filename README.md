# Reactive-app

An application to showcase FRP's benefits

### Install

```$ npm install ```

### Compile

```$ make ```

### Run

Configure nginx to pass /api url's to reactive-land-api and remember to configure nginx for Server-sent events.

```
upstream backend {
      server 127.0.0.1:4000;
    }
    
    server {
        listen  1338;
        server_name localhost;
        
        location /api {
            rewrite ^/api(/.*)$ "$1" break;
            proxy_pass http://backend;
            proxy_buffering off;
            proxy_cache off;
            proxy_set_header Host $host;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_http_version 1.1;
            chunked_transfer_encoding off;
        }       

        location / {
                root /Users/yourpath/reactive-land/dist;
                index index.html;
                proxy_set_header Connection '';
                proxy_http_version 1.1;
                chunked_transfer_encoding off;
                proxy_buffering off;
                proxy_cache off;
        }
    }
```
