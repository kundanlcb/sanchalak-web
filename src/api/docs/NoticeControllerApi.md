# NoticeControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createNotice**](#createnotice) | **POST** /api/notices | |
|[**deleteNotice**](#deletenotice) | **DELETE** /api/notices/{id} | |
|[**getNoticeDetails**](#getnoticedetails) | **GET** /api/notices/{id} | |
|[**getNotices**](#getnotices) | **GET** /api/notices | |
|[**getUnreadCount**](#getunreadcount) | **GET** /api/notices/unread-count | |
|[**updateNotice**](#updatenotice) | **PUT** /api/notices/{id} | |

# **createNotice**
> ApiResultNoticeDto createNotice(noticeRequest)


### Example

```typescript
import {
    NoticeControllerApi,
    Configuration,
    NoticeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeControllerApi(configuration);

let noticeRequest: NoticeRequest; //

const { status, data } = await apiInstance.createNotice(
    noticeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeRequest** | **NoticeRequest**|  | |


### Return type

**ApiResultNoticeDto**

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

# **deleteNotice**
> ApiResultVoid deleteNotice()


### Example

```typescript
import {
    NoticeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteNotice(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResultVoid**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getNoticeDetails**
> ApiResultNoticeDetailDto getNoticeDetails()


### Example

```typescript
import {
    NoticeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getNoticeDetails(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResultNoticeDetailDto**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getNotices**
> ApiResultMapStringObject getNotices()


### Example

```typescript
import {
    NoticeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeControllerApi(configuration);

let onlyRecent: boolean; // (optional) (default to false)
let onlyHighPriority: boolean; // (optional) (default to false)

const { status, data } = await apiInstance.getNotices(
    onlyRecent,
    onlyHighPriority
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **onlyRecent** | [**boolean**] |  | (optional) defaults to false|
| **onlyHighPriority** | [**boolean**] |  | (optional) defaults to false|


### Return type

**ApiResultMapStringObject**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUnreadCount**
> ApiResultMapStringLong getUnreadCount()


### Example

```typescript
import {
    NoticeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeControllerApi(configuration);

const { status, data } = await apiInstance.getUnreadCount();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResultMapStringLong**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateNotice**
> ApiResultNoticeDto updateNotice(noticeRequest)


### Example

```typescript
import {
    NoticeControllerApi,
    Configuration,
    NoticeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeControllerApi(configuration);

let id: number; // (default to undefined)
let noticeRequest: NoticeRequest; //

const { status, data } = await apiInstance.updateNotice(
    id,
    noticeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeRequest** | **NoticeRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResultNoticeDto**

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

