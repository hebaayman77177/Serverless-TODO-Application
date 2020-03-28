import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-p4q1u7kd.auth0.com/.well-known/jwks.json' //hh//

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized '+e.message, { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  logger.info("verifyToken")
  const token = getToken(authHeader)
  logger.info("token"+token)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  // const cert = "MIIDBjCCAe6gAwIBAgIIV/4XLt7Efh8wDQYJKoZIhvcNAQELBQAwITEfMB0GA1UEAxMWZGV2LXA0cTF1N2tkLmF1dGgwLmNvbTAeFw0yMDAyMjIwNjAwNTZaFw0zMzEwMzEwNjAwNTZaMCExHzAdBgNVBAMTFmRldi1wNHExdTdrZC5hdXRoMC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+BHzZg9cOq9BowHxcLcfEZNhSd1wME8pk3AbqW5WGQGo2oJpizDMwfgX/d4OOKuuSz/lRwQaim64r5e33Tl3ChTNc3fD/Y89+GiHno4MiYRFXB3dIyscI0TO19MwL5sVcd12UieEzMfCDU1NyTrxRmWn2+93+6iyTd/CE2STo+pN+M8IHqw4A3IXAHRBBLkrTJA8jl2trL7HCcLxHJ223PdbH6g0fTxgpC/Vy9SDl0iIddFF6rOBVxod/9uUPVuiyIUsovZkKeVr9yvhCGBpbLCWG1tOMaU+/kHpt1Bwi5Hugcm33iDuErrXG3opZdW9BPxJeikZb79WJMmntmaUvAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFMBdSTDfME6xRKeBhTneK8XriRYhMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAQBjbq2bkb0tLlPO81Ux5EJE/aRMWxPscT796b/Bbac5PlDaTQjBkXK6FCtdrFt9W0Fk2IQVQ8UvkJ9ZpXuhDCTuxxZ9tmjEvVblbLL7HtiwuyJKtPDR+yVZhSOr9zLAVtI13+IaW7BRU9+dzF2qx61W+0sCtsZrn5VveVoVW/BZ1GASDZR1EVYcUPDF8K/9tOg31Lkmg4ekQorb4OWBRDCvlpc3UW692+YUaw3d7sDhzx/CZ3aUt//vaiUZsQ8ULr++r0u6EWmKUMffEMwwTM3mZDIiUP9+CnDwE5VdeWHrpOflfLRxZhjSezZmb7+pGGTM9QPReT3OuyYUVW4scxw=="

  const cert = `-----BEGIN CERTIFICATE-----
MIIDBjCCAe6gAwIBAgIIV/4XLt7Efh8wDQYJKoZIhvcNAQELBQAwITEfMB0GA1UE
AxMWZGV2LXA0cTF1N2tkLmF1dGgwLmNvbTAeFw0yMDAyMjIwNjAwNTZaFw0zMzEw
MzEwNjAwNTZaMCExHzAdBgNVBAMTFmRldi1wNHExdTdrZC5hdXRoMC5jb20wggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+BHzZg9cOq9BowHxcLcfEZNhS
d1wME8pk3AbqW5WGQGo2oJpizDMwfgX/d4OOKuuSz/lRwQaim64r5e33Tl3ChTNc
3fD/Y89+GiHno4MiYRFXB3dIyscI0TO19MwL5sVcd12UieEzMfCDU1NyTrxRmWn2
+93+6iyTd/CE2STo+pN+M8IHqw4A3IXAHRBBLkrTJA8jl2trL7HCcLxHJ223PdbH
6g0fTxgpC/Vy9SDl0iIddFF6rOBVxod/9uUPVuiyIUsovZkKeVr9yvhCGBpbLCWG
1tOMaU+/kHpt1Bwi5Hugcm33iDuErrXG3opZdW9BPxJeikZb79WJMmntmaUvAgMB
AAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFMBdSTDfME6xRKeBhTne
K8XriRYhMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAQBjbq2bk
b0tLlPO81Ux5EJE/aRMWxPscT796b/Bbac5PlDaTQjBkXK6FCtdrFt9W0Fk2IQVQ
8UvkJ9ZpXuhDCTuxxZ9tmjEvVblbLL7HtiwuyJKtPDR+yVZhSOr9zLAVtI13+IaW
7BRU9+dzF2qx61W+0sCtsZrn5VveVoVW/BZ1GASDZR1EVYcUPDF8K/9tOg31Lkmg
4ekQorb4OWBRDCvlpc3UW692+YUaw3d7sDhzx/CZ3aUt//vaiUZsQ8ULr++r0u6E
WmKUMffEMwwTM3mZDIiUP9+CnDwE5VdeWHrpOflfLRxZhjSezZmb7+pGGTM9QPRe
T3OuyYUVW4scxw==
-----END CERTIFICATE-----`


  const res= verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  logger.info("Res",res)
  return res //\
}

function getToken(authHeader: string): string {
  logger.info("getToken")
  logger.info("header"+authHeader)
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
