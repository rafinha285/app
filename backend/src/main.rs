use hyper::{Body,Request,Response,Server};
use routerify::{Router, RouterService, Middleware};
use routerify::ext::RequestExt;
use std::convert::Infallible;
use std::fs::File;
use std::io::Read;
mod config;

async fn handle_request(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    Ok(Response::new(Body::from("Hello, World!")))
}

async fn handle_index_html(_req: Request<Body>) -> Response<Body> {
    let mut file = match File::open(config::BUILD_HTML) {
        Ok(file) => file,
        Err(_) => return Ok(Response::builder().status(404).body(Body::from("Not Found")).unwrap()),
    };
    let mut contents = String::new();
    if let Err(_) = file.read_to_string(&mut contents) {
        return Ok(Response::builder().status(500).body(Body::from("Internal Server Error")).unwrap());
    }
    Ok(Response::new(Body::from(contents)))
}

fn router() -> Router<Body, Infallible> {
    Router::builder()
        .get("/*", handle_index_html) // Corresponde a todas as solicitações
        .build()
        .unwrap()
}

#[tokio::main]
async fn main() {
    // Endereço do servidor
    let addr = ([0,0,0,0], 4433).into();

    // Serviço do Hyper
    let make_svc = make_service_fn(|_conn| {
        async {
            Ok::<_, Infallible>(service_fn(router()))
        }
    });

    // Servidor do Hyper
    let server = Server::bind(&addr).serve(make_svc);

    println!("Listening on http://{}", addr);

    // Executa o servidor
    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}