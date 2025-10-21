package com.majestor.api.infra.bootstrap;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.founder.FounderRepository;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import com.majestor.api.modules.lostfound.lostitem.LostItemRepository;
import com.majestor.api.modules.lostfound.lostitem.Status;
import com.majestor.api.modules.lostfound.shared.LastLocation;
import com.majestor.api.modules.user.Role;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FounderRepository founderRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");

        if (universityRepository.count() == 0) {
            initializeUniversitiesAndFaculties();
            log.info("Universities and faculties initialized successfully!");
        } else {
            log.info("Universities already exist, skipping initialization");
        }

        if (userRepository.findByEmail("abdullah@gmail.com") == null) {
            initializeAdminUser();
            log.info("Admin user initialized successfully!");
        } else {
            log.info("Admin user already exists, skipping initialization");
        }

        if (userRepository.count() < 5) { // Only if we have less than 5 users
            initializeSampleUsers();
            log.info("Sample users initialized successfully!");
        } else {
            log.info("Sample users already exist, skipping initialization");
        }

        if (lostItemRepository.count() == 0) {
            initializeLostItemsAndFounders();
            log.info("Lost items and founders initialized successfully!");
        } else {
            log.info("Lost items already exist, skipping initialization");
        }
    }

    private void initializeUniversitiesAndFaculties() {
        // Initialize Uzbek Universities
        initializeUzbekUniversities();

        // You can add more countries/regions here
        // initializeInternationalUniversities();
    }

    private void initializeUzbekUniversities() {
        // Tashkent State University of Economics
        University tsue = createUniversity(
                "Tashkent State University of Economics",
                "49 Islam Karimov Street, Tashkent, Uzbekistan"
        );

        createFaculties(tsue, List.of(
                "Faculty of Economics",
                "Faculty of Finance",
                "Faculty of Management",
                "Faculty of Marketing",
                "Faculty of Accounting",
                "Faculty of International Economic Relations",
                "Faculty of Business Administration",
                "Faculty of Information Technologies in Economics"
        ));

        // National University of Uzbekistan
        University nuu = createUniversity(
                "National University of Uzbekistan",
                "4 University Street, Tashkent, Uzbekistan"
        );

        createFaculties(nuu, List.of(
                "Faculty of Mathematics",
                "Faculty of Physics",
                "Faculty of Chemistry",
                "Faculty of Biology",
                "Faculty of Geography",
                "Faculty of History",
                "Faculty of Philology",
                "Faculty of Foreign Languages",
                "Faculty of Journalism",
                "Faculty of Psychology"
        ));

        // Tashkent University of Information Technologies
        University tuit = createUniversity(
                "Tashkent University of Information Technologies",
                "108 Amir Temur Avenue, Tashkent, Uzbekistan"
        );

        createFaculties(tuit, List.of(
                "Faculty of Computer Engineering",
                "Faculty of Software Engineering",
                "Faculty of Information Security",
                "Faculty of Telecommunications",
                "Faculty of Television Technologies",
                "Faculty of Radio Engineering and Mobile Communications",
                "Faculty of Information Systems and Technologies"
        ));

        // Tashkent Medical Academy
        University tma = createUniversity(
                "Tashkent Medical Academy",
                "2 Farabi Street, Tashkent, Uzbekistan"
        );

        createFaculties(tma, List.of(
                "Faculty of General Medicine",
                "Faculty of Pediatrics",
                "Faculty of Medical Prevention",
                "Faculty of Dentistry",
                "Faculty of Pharmacy",
                "Faculty of Medical Biology"
        ));

        // Westminster International University in Tashkent
        University wiut = createUniversity(
                "Westminster International University in Tashkent",
                "12 Istiqbol Street, Tashkent, Uzbekistan"
        );

        createFaculties(wiut, List.of(
                "Faculty of Engineering and Digital Technologies",
                "Faculty of Business and Finance",
                "Faculty of Media, Arts and Social Sciences"
        ));

        // Samarkand State University
        University ssu = createUniversity(
                "Samarkand State University",
                "15 University Boulevard, Samarkand, Uzbekistan"
        );

        createFaculties(ssu, List.of(
                "Faculty of Mathematics and Computer Science",
                "Faculty of Physics",
                "Faculty of Chemistry and Biology",
                "Faculty of History",
                "Faculty of Uzbek Philology",
                "Faculty of Foreign Languages",
                "Faculty of Geography and Ecology"
        ));

        log.info("Initialized {} universities with their faculties",
                universityRepository.count());
    }

    private void initializeAdminUser() {
        // Get the first university and faculty for the admin user
        University firstUniversity = universityRepository.findAll().get(0);
        Faculty firstFaculty = facultyRepository.findAll().get(0);

        User adminUser = User.builder()
                .email("abdullah@gmail.com")
                .username("abdullah_admin")
                .passwordHash(passwordEncoder.encode("admin"))
                .phone("+998901234567")
                .university(firstUniversity)
                .faculty(firstFaculty)
                .roles(List.of(Role.ADMIN))
                .isVerified(true)
                .verificationToken(null)
                .build();

        userRepository.save(adminUser);
        log.info("Created admin user with email: abdullah@gmail.com");
    }

    private void initializeSampleUsers() {
        List<University> universities = universityRepository.findAll();
        List<Faculty> faculties = facultyRepository.findAll();
        Random random = new Random();

        // Create sample students
        List<User> sampleUsers = List.of(
                User.builder()
                        .email("john.doe@student.com")
                        .username("john_doe")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("+998912345678")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build(),

                User.builder()
                        .email("jane.smith@student.com")
                        .username("jane_smith")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("+998923456789")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build(),

                User.builder()
                        .email("alex.johnson@student.com")
                        .username("alex_johnson")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("+998934567890")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build(),

                User.builder()
                        .email("sara.wilson@student.com")
                        .username("sara_wilson")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("+998945678901")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build()
        );

        userRepository.saveAll(sampleUsers);
        log.info("Created {} sample users", sampleUsers.size());
    }

    private void initializeLostItemsAndFounders() {
        List<User> users = userRepository.findAll();
        if (users.size() < 2) {
            log.warn("Not enough users to create lost items and founders");
            return;
        }

        // Create lost items
        List<LostItem> lostItems = List.of(
                LostItem.builder()
                        .title("Black iPhone 14 Pro")
                        .description("Black iPhone 14 Pro with cracked screen protector. Has a blue silicone case. Contains important photos and contacts.")
                        .phone("+998901111111")
                        .lastLocationDescription("Lost near the main library entrance at TSUE")
                        .lastLocation(LastLocation.builder().lat("41.311081").lng("69.240562").build())
                        .status(Status.LOST)
                        .owner(users.get(1))
                        .build(),

                LostItem.builder()
                        .title("Red Nike Backpack")
                        .description("Red Nike backpack with laptop compartment. Contains MacBook Air, textbooks, and personal items. Very important!")
                        .phone("+998902222222")
                        .lastLocationDescription("Left in the cafeteria at NUU during lunch break")
                        .lastLocation(LastLocation.builder().lat("41.298600").lng("69.267700").build())
                        .status(Status.LOST)
                        .owner(users.get(2))
                        .build(),

                LostItem.builder()
                        .title("Silver Car Keys")
                        .description("Silver Toyota car keys with black remote. Has a small Uzbekistan flag keychain attached.")
                        .phone("+998903333333")
                        .lastLocationDescription("Dropped somewhere in TUIT parking lot")
                        .lastLocation(LastLocation.builder().lat("41.327094").lng("69.228436").build())
                        .status(Status.LOST)
                        .owner(users.get(3))
                        .build(),

                LostItem.builder()
                        .title("Gold Watch")
                        .description("Gold Casio wristwatch, family heirloom. Has inscription 'To my beloved son' on the back.")
                        .phone("+998904444444")
                        .lastLocationDescription("Lost in the sports complex at Westminster University")
                        .lastLocation(LastLocation.builder().lat("41.295800").lng("69.249200").build())
                        .status(Status.LOST)
                        .owner(users.get(0))
                        .build(),

                LostItem.builder()
                        .title("Blue Wallet")
                        .description("Blue leather wallet containing student ID, driver's license, and some cash. Very important documents inside.")
                        .phone("+998905555555")
                        .lastLocationDescription("Dropped near the bus stop outside Samarkand State University")
                        .lastLocation(LastLocation.builder().lat("39.627012").lng("66.969604").build())
                        .status(Status.LOST)
                        .owner(users.size() > 4 ? users.get(4) : users.get(1))
                        .build(),

                LostItem.builder()
                        .title("Black Headphones")
                        .description("Sony WH-1000XM4 wireless headphones in black. Expensive noise-canceling headphones, birthday gift from parents.")
                        .phone("+998906666666")
                        .lastLocationDescription("Left in study room 203 at TMA library")
                        .lastLocation(LastLocation.builder().lat("41.285350").lng("69.203760").build())
                        .status(Status.LOST)
                        .owner(users.get(2))
                        .build()
        );

        lostItemRepository.saveAll(lostItems);
        log.info("Created {} lost items", lostItems.size());

        // Create founders for some lost items
        createFoundersForLostItems(lostItems, users);
    }

    private void createFoundersForLostItems(List<LostItem> lostItems, List<User> users) {
        Random random = new Random();

        // Create founders for the first 3 lost items
        List<Founder> founders = List.of(
                Founder.builder()
                        .name("Abdullah")
                        .phone("+998907777777")
                        .foundLocationDescription("Found the iPhone near the library stairs, exactly where described")
                        .lastLocation(LastLocation.builder().lat("41.311000").lng("69.240500").build())
                        .foundLostItem(lostItems.get(0))
                        .founder(users.get(random.nextInt(users.size())))
                        .build(),

                Founder.builder()
                        .name("Jane")
                        .phone("+998908888888")
                        .foundLocationDescription("Saw the red backpack under table 5 in the cafeteria")
                        .lastLocation(LastLocation.builder().lat("41.298650").lng("69.267750").build())
                        .foundLostItem(lostItems.get(1))
                        .founder(users.get(random.nextInt(users.size())))
                        .build(),

                Founder.builder()
                        .name("Alex")
                        .phone("+998909999999")
                        .foundLocationDescription("Found car keys near the security booth in TUIT parking")
                        .lastLocation(LastLocation.builder().lat("41.327050").lng("69.228400").build())
                        .foundLostItem(lostItems.get(2))
                        .founder(users.get(random.nextInt(users.size())))
                        .build(),

                // Multiple founders for the gold watch
                Founder.builder()
                        .name("Sara")
                        .phone("+998910000000")
                        .foundLocationDescription("Spotted the gold watch in the locker room after basketball practice")
                        .lastLocation(LastLocation.builder().lat("41.295820").lng("69.249180").build())
                        .foundLostItem(lostItems.get(3))
                        .founder(users.get(random.nextInt(users.size())))
                        .build(),

                Founder.builder()
                        .name("John")
                        .phone("+998911111111")
                        .foundLocationDescription("Saw someone wearing a similar gold watch in the cafeteria today")
                        .lastLocation(LastLocation.builder().lat("41.295780").lng("69.249220").build())
                        .foundLostItem(lostItems.get(3))
                        .founder(users.get(random.nextInt(users.size())))
                        .build()
        );

        founderRepository.saveAll(founders);
        log.info("Created {} founders for lost items", founders.size());
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

    // Optional: Add international universities
    private void initializeInternationalUniversities() {
        // Harvard University
        University harvard = createUniversity(
                "Harvard University",
                "Cambridge, MA, United States"
        );

        createFaculties(harvard, List.of(
                "Harvard College",
                "Harvard Medical School",
                "Harvard Business School",
                "Harvard Law School",
                "School of Engineering and Applied Sciences"
        ));

        // Oxford University
        University oxford = createUniversity(
                "University of Oxford",
                "Oxford, United Kingdom"
        );

        createFaculties(oxford, List.of(
                "Faculty of Arts",
                "Faculty of Science",
                "Faculty of Medicine",
                "Faculty of Law",
                "Faculty of Business"
        ));
    }
}