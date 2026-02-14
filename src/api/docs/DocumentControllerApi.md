# DocumentControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createDocument**](#createdocument) | **POST** /api/documents | |
|[**deleteDocument**](#deletedocument) | **DELETE** /api/documents/{id} | |
|[**getDocuments**](#getdocuments) | **GET** /api/documents/student/{studentId} | |
|[**getUploadUrl**](#getuploadurl) | **GET** /api/documents/upload-url | |

# **createDocument**
> ApiResultStudentDocumentDto createDocument(createDocumentRequest)


### Example

```typescript
import {
    DocumentControllerApi,
    Configuration,
    CreateDocumentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentControllerApi(configuration);

let createDocumentRequest: CreateDocumentRequest; //

const { status, data } = await apiInstance.createDocument(
    createDocumentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createDocumentRequest** | **CreateDocumentRequest**|  | |


### Return type

**ApiResultStudentDocumentDto**

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

# **deleteDocument**
> ApiResultVoid deleteDocument()


### Example

```typescript
import {
    DocumentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteDocument(
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

# **getDocuments**
> ApiResultListStudentDocumentDto getDocuments()


### Example

```typescript
import {
    DocumentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentControllerApi(configuration);

let studentId: number; // (default to undefined)

const { status, data } = await apiInstance.getDocuments(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResultListStudentDocumentDto**

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

# **getUploadUrl**
> ApiResultPresignedUrlDto getUploadUrl()


### Example

```typescript
import {
    DocumentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentControllerApi(configuration);

let fileName: string; // (default to undefined)
let mimeType: string; // (default to undefined)

const { status, data } = await apiInstance.getUploadUrl(
    fileName,
    mimeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileName** | [**string**] |  | defaults to undefined|
| **mimeType** | [**string**] |  | defaults to undefined|


### Return type

**ApiResultPresignedUrlDto**

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

