import requests
# A URL do Build Hook do Netlify que você copiou
NETLIFY_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/68af56e12b6db2b65057ca7a"

def trigger_netlify_build( ):
    try:
        response = requests.post(NETLIFY_BUILD_HOOK_URL)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins (4xx ou 5xx)
        print(f"Netlify build triggered successfully. Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error triggering Netlify build: {e}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

