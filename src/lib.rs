use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct FlickrResult {
    pub photos: Photos,
    pub stat: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Photos {
    pub page: i16,
    pub pages: i16,
    pub perpage: i16,
    pub total: String,
    pub photo: Vec<Photo>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Photo {
    pub id: String,
    pub owner: String,
    pub secret: String,
    pub server: String,
    pub farm: i32,
    pub title: String,
    pub ispublic: u8,
    pub isfriend: u8,
    pub isfamily: u8,
}

static API_KEY: &str = "b470517285bd684c1a3c2b6dad770b89";
static FLICKR_URL: &str = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
const IMAGES_PER_PAGE: i32 = 100;

#[wasm_bindgen]
pub async fn get_flickr_images(tag: String, page: i32) -> Result<JsValue, JsValue> {
    let url = format!("{}&api_key={}&per_page={}&tags={}&page={}&format=json&nojsoncallback=1", FLICKR_URL, API_KEY, IMAGES_PER_PAGE, tag, page);
    let res = reqwest::Client::new()
        .get(&url)
        .send()
        .await
        .unwrap();

    let text = res.text().await.unwrap();
    let result: FlickrResult = serde_json::from_str(&text).unwrap();

    Ok(JsValue::from_serde(&result).unwrap())
}