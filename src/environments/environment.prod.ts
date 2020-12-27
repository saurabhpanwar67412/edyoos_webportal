declare var EnvironmentConfig: any;
export const environment = {
  production: true,
  apiURL: EnvironmentConfig.getApiUrl(),
  mapApiKey: EnvironmentConfig.getMapApiKey(),
  blobURL: EnvironmentConfig.getblobURLKey(),
  blobAmenitiesContainer: EnvironmentConfig.getAmenititesContainerKey(),
   
};
