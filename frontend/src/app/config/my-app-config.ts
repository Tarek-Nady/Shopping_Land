// Default export of an OIDC configuration object.
export default {
    // The 'oidc' key holds the OpenID Connect specific configurations.
    oidc: {
        clientId: '0oaedlmzb7PLN89g15d7', // The Client ID for the Okta application.
        issuer: 'https://dev-55240353.okta.com/oauth2/default', // The URL of the Okta issuer. This is where your app will be making authentication requests.
        redirectUri: 'https://localhost:4200/login/callback', // The callback URL where the user will be sent after successful authentication. This should match one of the URLs registered in Okta.
        scopes: ['openid', 'profile', 'email'], // Scopes define the access privileges (openid for basic authentication, profile for user profile information, and email for user's email address).
    }
}
