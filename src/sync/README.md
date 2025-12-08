# Overview of Syncing

## Pull GET /{version}/{collection}/pull?batchSize={batchSize}?id={id}?updatedAt={updatedAt}
### Expects "batchSize", "id", and "updatedAt" query parameters
A get request that gets all documents from the server that have been updated since the last checkpoint. The server will return a list of documents and a new checkpoint.

### Returns
- 200 OK: A list of documents and a new checkpoint.
- 204 No Content: If there are no new documents since the last checkpoint.
- 400 Bad Request: If the checkpoint is not provided or is invalid.
- 401 Unauthorized: If the user is not authenticated.
- 500 Internal Server Error: If there is an error on the server.

```json
{
  "checkpoint": "",
  "documents": []
}
```

## Push POST /{version}/{collection}/push
### Expects Body to be an array of documents
A post request that sends all documents to the server that have been created or updated since the last checkpoint. The server will return a list of conflicts.

### Returns
- 200 OK: A list of conflicts.
- 401 Unauthorized: If the user is not authenticated.
- 500 Internal Server Error: If there is an error on the server.

```json
[]
```

## Websockets /{version}/ws
A websocket connection that allows the client to recieve real-time updates from the server. The server will send out events when documents are created, updated, or deleted. The client can also send events to the server to create, update, or delete documents.

### Returns
- 200 OK: A websocket connection.
- 401 Unauthorized: If the user is not authenticated.
- 500 Internal Server Error: If there is an error on the server.
- 400 Bad Request: If the request is invalid.
- 408 Request Timeout: If the request times out.