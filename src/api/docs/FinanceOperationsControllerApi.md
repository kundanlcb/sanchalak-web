# FinanceOperationsControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**downloadReceipt**](#downloadreceipt) | **GET** /api/finance/receipts/{receiptNo} | |
|[**getStudentLedger**](#getstudentledger) | **GET** /api/finance/students/{id}/ledger | |
|[**recordPayment**](#recordpayment) | **POST** /api/finance/transactions | |

# **downloadReceipt**
> Array<string> downloadReceipt()


### Example

```typescript
import {
    FinanceOperationsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceOperationsControllerApi(configuration);

let receiptNo: string; // (default to undefined)

const { status, data } = await apiInstance.downloadReceipt(
    receiptNo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **receiptNo** | [**string**] |  | defaults to undefined|


### Return type

**Array<string>**

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

# **getStudentLedger**
> StudentLedgerDto getStudentLedger()


### Example

```typescript
import {
    FinanceOperationsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceOperationsControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getStudentLedger(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StudentLedgerDto**

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

# **recordPayment**
> PaymentTransactionDto recordPayment(paymentRequestDto)


### Example

```typescript
import {
    FinanceOperationsControllerApi,
    Configuration,
    PaymentRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new FinanceOperationsControllerApi(configuration);

let paymentRequestDto: PaymentRequestDto; //

const { status, data } = await apiInstance.recordPayment(
    paymentRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paymentRequestDto** | **PaymentRequestDto**|  | |


### Return type

**PaymentTransactionDto**

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

