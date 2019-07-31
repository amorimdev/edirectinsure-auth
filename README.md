# EDirectInsure Auth

This service is responsible for managing authentication

### Patterns

```
role: auth, cmd: encrypt-password
role: auth, cmd: login
role: auth, cmd: logout
role: auth, cmd: valid-token
```

### Service Dependency

- User

### Installing

```bash
$ npm i
```

### Package Dependency

 - [seneca](https://github.com/senecajs/seneca)
 - [lodash](https://github.com/lodash/lodash)
 - [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
 - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
 - [redis](https://github.com/NodeRedis/node_redis)

### Environment Variables

```
AUTH_HOST # auth service host
AUTH_PORT # auth service port

USER_HOST # user service host
USER_PORT # user service port

SECRET # auth token secret
REDIS_URL # url from redis server
TOKEN_TTL # token ttl from redis
```

### Tests


```sh
$ npm test
```

Run tests with Node debugger:

```bash
$ npm run test-debugger
```
