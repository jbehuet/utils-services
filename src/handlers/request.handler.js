class RequestHandler {

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    showError(error) {
        console.log(error);
        this.res.writeHead(500);
        this.res.end('oO Ouppss something doesn\'t work, please try again\n' +
            'Usage : ' + req.headers.host + '/?url={ICS_URL}');
    }

}

export default RequestHandler;