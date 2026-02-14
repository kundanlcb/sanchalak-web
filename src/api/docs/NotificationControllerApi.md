# NotificationControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**registerToken**](#registertoken) | **POST** /api/notifications/register | |
|[**unregisterToken**](#unregistertoken) | **POST** /api/notifications/unregister | |

# **registerToken**
> ApiResultTokenRegistrationResponse registerToken(notificationTokenDto)


### Example

```typescript
import {
    NotificationControllerApi,
    Configuration,
    NotificationTokenDto
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationControllerApi(configuration);

let notificationTokenDto: NotificationTokenDto; //

const { status, data } = await apiInstance.registerToken(
    notificationTokenDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **notificationTokenDto** | **NotificationTokenDto**|  | |


### Return type

**ApiResultTokenRegistrationResponse**

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

# **unregisterToken**
> ApiResultString unregisterToken(notificationTokenDto)


### Example

```typescript
import {
    NotificationControllerApi,
    Configuration,
    NotificationTokenDto
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationControllerApi(configuration);

let notificationTokenDto: NotificationTokenDto; //

const { status, data } = await apiInstance.unregisterToken(
    notificationTokenDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **notificationTokenDto** | **NotificationTokenDto**|  | |


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

