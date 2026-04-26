package com.majestor.api.infra.bootstrap;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.course.CourseRepository;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.StudyGroupRepository;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMember;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMemberRepository;
import com.majestor.api.modules.user.Role;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) {
        log.info("=== DataInitializer starting ===");

        try {
            log.info("Initializing universities and faculties...");
            initializeUniversitiesAndFaculties();
            log.info("Universities and faculties initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize universities and faculties: {}", e.getMessage(), e);
        }

        try {
            log.info("Initializing admin user...");
            initializeAdminUser();
            log.info("Admin user created successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize admin user: {}", e.getMessage(), e);
        }

        try {
            log.info("Initializing courses...");
            initializeCourses();
            log.info("Courses initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize courses: {}", e.getMessage(), e);
        }

        log.info("=== DataInitializer finished ===");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void initializeCourses() {
        List<Faculty> faculties = facultyRepository.findAll();

        List<Course> courses = new ArrayList<>();

        for (Faculty faculty : faculties) {
            if (faculty.getName().equals("Faculty of Computing")) {
                courses.add(Course.builder().name("Introduction to Programming").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Introduction to Programming Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Ideology and Constitution of Pakistan").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Functional English").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Calculus and Analytic Geometry").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Application of Information & Communication Technologies").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Application of Information & Communication Technologies Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Object Oriented Programming").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Object Oriented Programming Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Applied Physics").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Applied Physics Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Expository Writing").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Sociology").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Discrete Structures").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Islamic Studies / Ethics").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Fehm-ul-Quran I").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Data Structures").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Data Structures Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Introduction to Database Systems").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Introduction to Database Systems Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Linear Algebra").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Personal Grooming").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Digital Logic Design").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Digital Logic Design Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Fehm-ul-Quran II").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Computer Organization and Assembly Language").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Computer Organization and Assembly Language Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Entrepreneurship").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Database Management Systems").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Database Management Systems Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Pakistan Studies").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Probability & Statistics").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Civics and Professional Ethics").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Multi-Variate Calculus").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Design and Analysis of Algorithms").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Operating Systems").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Operating Systems Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Software Engineering").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Computer Networks").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Computer Networks Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Graph Algorithm").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Computer Architecture").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Computer Architecture Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Parallel and Distributing Computing").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Parallel and Distributing Computing Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Artificial Intelligence").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Artificial Intelligence Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Technical and Business Writing").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Web Application Development").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Web Application Development Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Introduction to Information Security and Forensics").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Introduction to Information Security and Forensics Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Numerical Computing").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Numerical Computing Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Mobile Application Development").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Mobile Application Development Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Machine Learning").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Human Computer Interaction").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Human Computer Interaction Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Design Project 1").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Theory of Automata and Formal Languages").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Design Project 2").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Introduction to Data Warehousing").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Compiler Construction").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Compiler Construction Lab").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Financial Accounting").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
                courses.add(Course.builder().name("Blockchain Technology").facultyCourses(faculty).createdAt(Instant.now()).updatedAt(Instant.now()).build());
            }
        }

        courseRepository.saveAll(courses);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void initializeUniversitiesAndFaculties() {
        // Capital University of Science & Technology
        University cust = createUniversity(
                "Capital University of Science & Technology",
                "Expressway, Kahuta Road, Zone-V, Islamabad, Pakistan",
                List.of("cust.pk", "cust.edu.pk")
        );

        createFaculties(cust, List.of(
                "Faculty of Computing"
        ));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void initializeAdminUser() {
        University firstUniversity = universityRepository.findAll().getFirst();
        Faculty firstFaculty = facultyRepository.findAll().getFirst();

        User admin = User.builder()
                .email("bcs233188@cust.pk")
                .username("AZ")
                .passwordHash(passwordEncoder.encode("Cust@23"))
                .phone("03155180641")
                .avatar("")
                .hasOnboarded(Boolean.FALSE)
                .university(firstUniversity)
                .faculty(firstFaculty)
                .roles(List.of(Role.ADMIN, Role.STUDENT))
                .isFaculty(false)
                .isVerified(true)
                .verificationToken(null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        userRepository.save(admin);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected University createUniversity(String name, String address, List<String> domains) {
        University university = University.builder()
                .name(name)
                .address(address)
                .allowedDomains(domains)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return universityRepository.save(university);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void createFaculties(University university, List<String> facultyNames) {
        List<Faculty> faculties = facultyNames.stream()
                .map(name -> Faculty.builder()
                        .name(name)
                        .universityFaculties(university)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()
                )
                .toList();

        facultyRepository.saveAll(faculties);
    }
}