self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/treksdekho-frontend/v1/:path*"
      }
    ],
    "beforeFiles": [
      {
        "source": "/treksdekho-frontend//_next/:path+",
        "destination": "/treksdekho-frontend/_next/:path+"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()