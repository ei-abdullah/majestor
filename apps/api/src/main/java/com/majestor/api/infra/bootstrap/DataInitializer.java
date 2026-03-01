package com.majestor.api.infra.bootstrap;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.course.CourseRepository;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.user.Role;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public void run(String... args) {

        if (universityRepository.count() == 0) {
            initializeUniversitiesAndFaculties();
        }

        if (userRepository.findByEmail("bcs233188@cust.pk").isEmpty()) {
            initializeAdminUser();
        }

        if (courseRepository.count() == 0) {
            initializeCourses();
        }
    }

    private void initializeCourses() {
        List<Faculty> faculties = facultyRepository.findAll();

        List<Course> courses = new ArrayList<>();

        for (Faculty faculty : faculties) {
            if (faculty.getName().equals("Faculty of Computing")) {
                courses.add(Course.builder().name("Introduction to Programming").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Introduction to Programming Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Ideology and Constitution of Pakistan").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Functional English").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Calculus and Analytic Geometry").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Application of Information & Communication Technologies").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Application of Information & Communication Technologies Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Object Oriented Programming").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Object Oriented Programming Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Applied Physics").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Applied Physics Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Expository Writing").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Sociology").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Discrete Structures").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Islamic Studies / Ethics").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Fehm-ul-Quran I").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Data Structures").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Data Structures Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Introduction to Database Systems").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Introduction to Database Systems Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Linear Algebra").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Personal Grooming").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Digital Logic Design").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Digital Logic Design Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Fehm-ul-Quran II").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Computer Organization and Assembly Language").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Computer Organization and Assembly Language Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Entrepreneurship").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Database Management Systems").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Database Management Systems Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Pakistan Studies").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Probability & Statistics").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Civics and Professional Ethics").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Multi-Variate Calculus").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Design and Analysis of Algorithms").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Operating Systems").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Operating Systems Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Software Engineering").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Computer Networks").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Computer Networks Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Graph Algorithm").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Computer Architecture").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Computer Architecture Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Parallel and Distributing Computing").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Parallel and Distributing Computing Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Artificial Intelligence").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Artificial Intelligence Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Technical and Business Writing").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Web Application Development").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Web Application Development Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Introduction to Information Security and Forensics").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Introduction to Information Security and Forensics Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Numerical Computing").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Numerical Computing Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Mobile Application Development").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Mobile Application Development Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Machine Learning").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Human Computer Interaction").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Human Computer Interaction Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Design Project 1").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Theory of Automata and Formal Languages").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Design Project 2").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Introduction to Data Warehousing").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Compiler Construction").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Compiler Construction Lab").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Financial Accounting").facultyCourses(faculty).build());
                courses.add(Course.builder().name("Blockchain Technology").facultyCourses(faculty).build());
            }
        }

        courseRepository.saveAll(courses);
    }

    private void initializeUniversitiesAndFaculties() {
        initializePakistaniUniversities();
    }

    private void initializePakistaniUniversities() {
        // Capital University of Science & Technology
        University cust = createUniversity(
                "Capital University of Science & Technology",
                "Expressway, Kahuta Road, Zone-V, Islamabad, Pakistan"
        );

        createFaculties(cust, List.of(
                "Faculty of Computing"
        ));
    }

    private void initializeAdminUser() {
        University firstUniversity = universityRepository.findAll().getFirst();
        Faculty firstFaculty = facultyRepository.findAll().getFirst();

        User adminUser1 = User.builder()
                .email("bcs233188@cust.pk")
                .username("AZ")
                .passwordHash(passwordEncoder.encode("Cust@23"))
                .phone("03155180641")
                .avatar("")
                .hasOnboarded(Boolean.FALSE)
                .university(firstUniversity)
                .studentFaculty(firstFaculty)
                .roles(List.of(Role.ADMIN, Role.STUDENT))
                .isVerified(true)
                .verificationToken(null)
                .build();

        User adminUser2 = User.builder()
                .email("bcs233189@cust.pk")
                .username("ZA")
                .passwordHash(passwordEncoder.encode("Cust@23"))
                .phone("03155180641")
                .avatar("")
                .hasOnboarded(Boolean.FALSE)
                .university(firstUniversity)
                .studentFaculty(firstFaculty)
                .roles(List.of(Role.ADMIN, Role.STUDENT))
                .isVerified(true)
                .verificationToken(null)
                .build();

        userRepository.save(adminUser1);
        userRepository.save(adminUser2);
    }

    private University createUniversity(String name, String address) {
        University university = University.builder()
                .name(name)
                .address(address)
                .build();

        return universityRepository.save(university);
    }

    private void createFaculties(University university, List<String> facultyNames) {
        List<Faculty> faculties = facultyNames.stream()
                .map(name -> Faculty.builder()
                        .name(name)
                        .universityFaculties(university)
                        .build())
                .toList();

        facultyRepository.saveAll(faculties);
    }


}