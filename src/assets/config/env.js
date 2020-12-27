
var EnvironmentConfig = (function () {
  return {
    getApiUrl: () => {
      return '#{ApiUrl}#'
    },
    getMapApiKey: () => {
      return '#{MapApiKey}#'
    },
    getblobURLKey: () => {
      return '#{BlobURL}#'
    },
    getAmenititesContainerKey: () => {
      return '#{AmenitiesContainer}#'
    },

    getAppleClientId: () => {
      return '#{AppleClientId}#'
    },
    getFacebookAppId: () => {
      return '#{FacebookAppId}#'
    },
    getFacebookAppIdVersion: () => {
      return '#{FacebookAppIdVersion}#'
    },
    getGoogleClientId: () => {
      return '#{GoogleClientId}#'
    }
    
    // getFacebookAppId: () => {
    //   return '920256775048563'
    // },
    // getFacebookAppIdVersion: () => {
    //   return 'v8.0'
    // },
    // getGoogleClientId: () => {
    //   return '705000145704-4hjs38pgf4n3f5kfbaj5e1ci78ivgvmg.apps.googleusercontent.com'
    // },
    // getAppleClientId: () => {
    //   return 'com.uathydedyoosdev'
    // }

  }

})(EnvironmentConfig || {});
