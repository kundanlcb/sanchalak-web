# AuthTokenResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **string** |  | [optional] [default to undefined]
**refreshToken** | **string** |  | [optional] [default to undefined]
**tokenType** | **string** |  | [optional] [default to undefined]
**expiresIn** | **number** |  | [optional] [default to undefined]
**user** | [**UserProfileDto**](UserProfileDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AuthTokenResponseDto } from './api';

const instance: AuthTokenResponseDto = {
    accessToken,
    refreshToken,
    tokenType,
    expiresIn,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
