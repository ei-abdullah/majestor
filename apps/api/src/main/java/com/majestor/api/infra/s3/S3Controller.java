package com.majestor.api.infra.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @DeleteMapping("/emptyBucket/{bucketName}")
    public void emptyBucket(
            @PathVariable("bucketName") String bucketName
    ) {
        s3Service.emptyBucket(bucketName);
    }
}
