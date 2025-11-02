package com.majestor.api.infra.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    public void uploadFile(byte[] file, String key, String bucketName) {
        PutObjectRequest objectRequest = PutObjectRequest
                .builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.putObject(objectRequest, RequestBody.fromBytes(file));
    }

    public byte[] downloadFile(String key, String bucketName) {
        GetObjectRequest objectRequest = GetObjectRequest
                .builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try (ResponseInputStream<GetObjectResponse> response = s3Client.getObject(objectRequest)) {
            return response.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file from S3: " + e.getMessage());
        }
    }

    public void deleteFile(String key, String bucketName) {
        DeleteObjectRequest objectRequest = DeleteObjectRequest
                .builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(objectRequest);
    }

    public void emptyBucket(String bucketName) {
        try {
            ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();

            ListObjectsV2Response listResponse;

            do {
                listResponse = s3Client.listObjectsV2(listRequest);

                if (listResponse.contents().isEmpty()) {
                    break;
                }

                List<ObjectIdentifier> objectsToDelete = listResponse.contents().stream()
                        .map(s3Object -> ObjectIdentifier.builder()
                                .key(s3Object.key())
                                .build())
                        .toList();

                Delete delete = Delete.builder()
                        .objects(objectsToDelete)
                        .build();

                DeleteObjectsRequest deleteRequest = DeleteObjectsRequest.builder()
                        .bucket(bucketName)
                        .delete(delete)
                        .build();

                s3Client.deleteObjects(deleteRequest);

                listRequest = listRequest.toBuilder()
                        .continuationToken(listResponse.nextContinuationToken())
                        .build();

            } while (listResponse.isTruncated());

        } catch (Exception e) {
            throw new RuntimeException("Failed to empty bucket: " + e.getMessage());
        }
    }

}
