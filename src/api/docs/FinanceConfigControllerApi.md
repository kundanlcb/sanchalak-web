# FinanceConfigControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignStructure**](#assignstructure) | **POST** /api/finance/structures/{id}/assign | |
|[**createCategory**](#createcategory) | **POST** /api/finance/categories | |
|[**createStructure**](#createstructure) | **POST** /api/finance/structures | |
|[**deleteCategory**](#deletecategory) | **DELETE** /api/finance/categories/{id} | |
|[**deleteStructure**](#deletestructure) | **DELETE** /api/finance/structures/{id} | |
|[**getAllCategories**](#getallcategories) | **GET** /api/finance/categories | |
|[**getAllStructures**](#getallstructures) | **GET** /api/finance/structures | |
|[**updateCategory**](#updatecategory) | **PUT** /api/finance/categories/{id} | |
|[**updateStructure**](#updatestructure) | **PUT** /api/finance/structures/{id} | |

# **assignStructure**
> assignStructure()


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let id: number; // (default to undefined)
let classId: number; // (default to undefined)

const { status, data } = await apiInstance.assignStructure(
    id,
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **classId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createCategory**
> FeeCategoryDto createCategory(feeCategoryDto)


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration,
    FeeCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let feeCategoryDto: FeeCategoryDto; //

const { status, data } = await apiInstance.createCategory(
    feeCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **feeCategoryDto** | **FeeCategoryDto**|  | |


### Return type

**FeeCategoryDto**

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

# **createStructure**
> FeeStructureDto createStructure(feeStructureDto)


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration,
    FeeStructureDto
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let feeStructureDto: FeeStructureDto; //

const { status, data } = await apiInstance.createStructure(
    feeStructureDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **feeStructureDto** | **FeeStructureDto**|  | |


### Return type

**FeeStructureDto**

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

# **deleteCategory**
> deleteCategory()


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteCategory(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteStructure**
> deleteStructure()


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteStructure(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllCategories**
> Array<FeeCategoryDto> getAllCategories()


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

const { status, data } = await apiInstance.getAllCategories();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<FeeCategoryDto>**

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

# **getAllStructures**
> Array<FeeStructureDto> getAllStructures()


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

const { status, data } = await apiInstance.getAllStructures();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<FeeStructureDto>**

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

# **updateCategory**
> FeeCategoryDto updateCategory(feeCategoryDto)


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration,
    FeeCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let id: number; // (default to undefined)
let feeCategoryDto: FeeCategoryDto; //

const { status, data } = await apiInstance.updateCategory(
    id,
    feeCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **feeCategoryDto** | **FeeCategoryDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**FeeCategoryDto**

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

# **updateStructure**
> FeeStructureDto updateStructure(feeStructureDto)


### Example

```typescript
import {
    FinanceConfigControllerApi,
    Configuration,
    FeeStructureDto
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceConfigControllerApi(configuration);

let id: number; // (default to undefined)
let feeStructureDto: FeeStructureDto; //

const { status, data } = await apiInstance.updateStructure(
    id,
    feeStructureDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **feeStructureDto** | **FeeStructureDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**FeeStructureDto**

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

