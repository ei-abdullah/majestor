package com.majestor.api.modules.auth;

import com.majestor.api.infra.emailservice.EmailService;
import com.majestor.api.infra.exception.DuplicateResourceException;
import com.majestor.api.infra.exception.InsufficientAuthenticationException;
import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.jwt.JwtService;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.auth.dto.AuthResponseDTO;
import com.majestor.api.modules.auth.dto.AuthUserDTO;
import com.majestor.api.modules.auth.dto.LoginRequestDTO;
import com.majestor.api.modules.auth.dto.SignupRequestDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UniversityRepository universityRepository;
    @Mock
    private FacultyRepository facultyRepository;
    @Mock
    private AuthMapper authMapper;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("http");
        request.setServerName("localhost");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    /* ------------------------ Signup Tests ------------------------ */
    @Test
    void signup_throwsDuplicateException_whenEmailExists() {
        SignupRequestDTO request = createSignupRequestDTO();

        when(userRepository.existsByEmail("abdullah@cust.pk")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_throwsResourceNotFoundException_whenUniversityNotFound() {
        SignupRequestDTO request = createSignupRequestDTO();

        when(userRepository.existsByEmail("abdullah@cust.pk")).thenReturn(false);

        when(universityRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("University not found");
    }

    @Test
    void signup_throwsResourceNotFoundException_whenFacultyNotFound() {
        SignupRequestDTO request = createSignupRequestDTO();

        when(userRepository.existsByEmail("abdullah@cust.pk")).thenReturn(false);

        University university = buildUniversity();

        when(universityRepository.findById(1L)).thenReturn(Optional.of(university));

        when(facultyRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Faculty not found");
    }

    @Test
    void signup_throwsIllegalArgumentException_whenEmailDomainsNotAllowed() {
        SignupRequestDTO request = createSignupRequestDTO();

        University university = new University();
        university.setAllowedDomains(List.of("nu.edu.pk"));

        when(userRepository.existsByEmail("abdullah@cust.pk")).thenReturn(false);
        when(universityRepository.findById(1L)).thenReturn(Optional.of(university));
        when(facultyRepository.findById(2L)).thenReturn(Optional.of(buildFaculty()));

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email domain is not allowed for the selected university");
    }

    @Test
    void signup_savesUser() {
        SignupRequestDTO request = createSignupRequestDTO();
        University university = buildUniversity();
        Faculty faculty = buildFaculty();

        when(userRepository.existsByEmail("abdullah@cust.pk")).thenReturn(false);
        when(universityRepository.findById(1L)).thenReturn(Optional.of(university));
        when(facultyRepository.findById(2L)).thenReturn(Optional.of(faculty));

        User user = buildUser();
        when(authMapper.toUser(any(), any(), any(), any())).thenReturn(user);

        authService.signup(request);

        verify(userRepository).save(user);
        verify(emailService).sendVerificationEmail(eq(user.getEmail()), anyString());
    }


    /* ------------------------ Login Tests ------------------------ */
    @Test
    void login_throwsResourceNotFoundException_whenUserNotFound() {
        LoginRequestDTO request = createLoginRequestDTO();

        String lowerCasedEmail = request.getEmail().trim().toLowerCase();
        when(userRepository.findByEmail(lowerCasedEmail)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found with email: " + request.getEmail());
    }

    @Test
    void login_throwsInsufficientAuthenticationException_whenCredentialsAreInvalid() {
        LoginRequestDTO request = createLoginRequestDTO();

        String lowerCasedEmail = request.getEmail().trim().toLowerCase();
        when(userRepository.findByEmail(lowerCasedEmail)).thenReturn(Optional.of(buildUser()));

        Authentication mockAuthentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(mockAuthentication);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InsufficientAuthenticationException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void login_returnsAuthResponseDTO() {
        LoginRequestDTO request = createLoginRequestDTO();

        String lowerCasedEmail = request.getEmail().trim().toLowerCase();
        User user = buildUser();
        when(userRepository.findByEmail(lowerCasedEmail)).thenReturn(Optional.of(user));

        Authentication mockAuthentication = mock(Authentication.class);
        when(mockAuthentication.isAuthenticated()).thenReturn(true);
        when(authenticationManager.authenticate(any())).thenReturn(mockAuthentication);

        when(jwtService.generateAccessToken(any())).thenReturn("mockAccessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("mockRefreshToken");

        when(authMapper.toAuthUserDTO(any())).thenReturn(AuthUserDTO.builder().build());
        when(authMapper.toAuthResponseDTO(anyString(), anyString(), any())).thenReturn(createAuthResponseDTO());

        AuthResponseDTO result = authService.login(request);

        assertThat(result).isNotNull();
    }


    /* ------------------------ Helper Methods ------------------------ */
    private SignupRequestDTO createSignupRequestDTO() {
        return SignupRequestDTO
                .builder()
                .username("AZ")
                .email("abdullah@cust.pk")
                .password("secret123")
                .isFaculty(false)
                .universityId(1L)
                .facultyId(2L)
                .build();
    }

    private LoginRequestDTO createLoginRequestDTO() {
        return LoginRequestDTO
                .builder()
                .email("abdullah@cust.pk")
                .password("secret123")
                .build();
    }

    private User buildUser() {
        User u = new User();
        u.setUsername("AZ");
        u.setEmail("abdullah@cust.pk");
        u.setUniversity(buildUniversity());
        u.setFaculty(buildFaculty());

        return u;
    }

    private University buildUniversity() {
        University u = new University();
        u.setAllowedDomains(List.of("cust.pk", "cust.edu.pk"));
        return u;
    }

    private Faculty buildFaculty() {
        Faculty f = new Faculty();
        f.setUniversityFaculties(buildUniversity());
        return f;
    }

    private AuthResponseDTO createAuthResponseDTO() {
        return AuthResponseDTO
                .builder()
                .accessToken("mockAccessToken")
                .refreshToken("mockRefreshToken")
                .authUserDTO(AuthUserDTO.builder().build())
                .build();
    }
}

