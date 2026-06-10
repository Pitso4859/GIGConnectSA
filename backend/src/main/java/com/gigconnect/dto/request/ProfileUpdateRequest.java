package com.gigconnect.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @Size(min = 2, max = 100)
    private String fullName;
    private String phone;
    private String location;
    @Size(max = 500)
    private String bio;
    private String avatarUrl;
    private String idNumber;
}
