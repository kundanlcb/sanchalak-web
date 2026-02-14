# AuthenticationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authenticateUser**](#authenticateuser) | **POST** /api/auth/signin | |
|[**logout**](#logout) | **POST** /api/auth/logout | Logout (Mobile)|
|[**refreshToken**](#refreshtoken) | **POST** /api/auth/refresh | Refresh Access Token|
|[**registerUser**](#registeruser) | **POST** /api/auth/signup | |
|[**requestOtp**](#requestotp) | **POST** /api/auth/otp/request | Request OTP for mobile login|
|[**verifyOtp**](#verifyotp) | **POST** /api/auth/otp/verify | Verify Mobile OTP|

# **authenticateUser**
> object authenticateUser(loginRequest)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.authenticateUser(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**object**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> ApiResultString logout(refreshTokenRequestDto)

Revokes the specified refresh token so it cannot be used again.

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RefreshTokenRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let refreshTokenRequestDto: RefreshTokenRequestDto; //

const { status, data } = await apiInstance.logout(
    refreshTokenRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenRequestDto** | **RefreshTokenRequestDto**|  | |


### Return type

**ApiResultString**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Logout failed |  -  |
|**200** | Logged out successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshToken**
> ApiResultAuthTokenResponseDto refreshToken(refreshTokenRequestDto)

Exchanges a valid refresh token for a new access token and rotated refresh token.

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RefreshTokenRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let refreshTokenRequestDto: RefreshTokenRequestDto; //

const { status, data } = await apiInstance.refreshToken(
    refreshTokenRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenRequestDto** | **RefreshTokenRequestDto**|  | |


### Return type

**ApiResultAuthTokenResponseDto**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tokens refreshed successfully |  -  |
|**401** | Invalid refresh token or Reuse attempt detected |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerUser**
> object registerUser(signUpRequest)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    SignUpRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let signUpRequest: SignUpRequest; //

const { status, data } = await apiInstance.registerUser(
    signUpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpRequest** | **SignUpRequest**|  | |


### Return type

**object**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestOtp**
> ApiResultString requestOtp(otpRequestDto)

Generates and sends a 6-digit OTP to the registered mobile number

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    OtpRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let otpRequestDto: OtpRequestDto; //

const { status, data } = await apiInstance.requestOtp(
    otpRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **otpRequestDto** | **OtpRequestDto**|  | |


### Return type

**ApiResultString**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | User not found or invalid request |  -  |
|**429** | Rate limit exceeded (max 3 attempts per 15 min) |  -  |
|**200** | OTP sent successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyOtp**
> ApiResultAuthTokenResponseDto verifyOtp(otpVerifyDto)

Validates the OTP and returns JWT access/refresh tokens. Used for mobile app login.

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    OtpVerifyDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let otpVerifyDto: OtpVerifyDto; //

const { status, data } = await apiInstance.verifyOtp(
    otpVerifyDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **otpVerifyDto** | **OtpVerifyDto**|  | |


### Return type

**ApiResultAuthTokenResponseDto**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful, tokens issued |  -  |
|**400** | Invalid OTP or User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

