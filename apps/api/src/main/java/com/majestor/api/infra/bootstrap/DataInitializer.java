package com.majestor.api.infra.bootstrap;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.course.CourseRepository;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.founder.FounderRepository;
import com.majestor.api.modules.lostfound.founder.founditemimage.FoundItemImage;
import com.majestor.api.modules.lostfound.founder.founditemimage.FoundItemImageRepository;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import com.majestor.api.modules.lostfound.lostitem.LostItemRepository;
import com.majestor.api.modules.lostfound.lostitem.Status;
import com.majestor.api.modules.lostfound.lostitem.lostitemimage.LostItemImage;
import com.majestor.api.modules.lostfound.lostitem.lostitemimage.LostItemImageRepository;
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

import java.util.ArrayList;
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
    private final LostItemImageRepository lostItemImageRepository;
    private final FounderRepository founderRepository;
    private final FoundItemImageRepository foundItemImageRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;

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

        if (userRepository.findByEmail("abdullah@gmail.com").isEmpty()) {
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

        if (courseRepository.count() == 0) {
            initializeCourses();
        } else {
            log.info("Courses already exist, skipping initialization");
        }
    }

    private void initializeCourses() {
        List<Faculty> faculties = facultyRepository.findAll();

        List<Course> courses = new ArrayList<>();

        for (Faculty faculty : faculties) {
            // Add some sample courses for each faculty
            courses.add(Course.builder()
                    .name("Introduction to " + faculty.getName())
                    .facultyCourses(faculty)
                    .build());

            courses.add(Course.builder()
                    .name(faculty.getName() + " Advanced Studies")
                    .facultyCourses(faculty)
                    .build());
        }

        courseRepository.saveAll(courses);
        log.info("Initialized {} courses across faculties", courses.size());
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
                .phone("03000000000")
                .avatar("")
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
                        .avatar("")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build(),

                User.builder()
                        .email("jane.smith@student.com")
                        .username("jane_smith")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("03091234568")
                        .avatar("")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build(),

                User.builder()
                        .email("alex.johnson@student.com")
                        .username("alex_johnson")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("03091234569")
                        .avatar("")
                        .university(universities.get(random.nextInt(universities.size())))
                        .faculty(faculties.get(random.nextInt(faculties.size())))
                        .roles(List.of(Role.STUDENT))
                        .isVerified(true)
                        .build(),

                User.builder()
                        .email("sara.wilson@student.com")
                        .username("sara_wilson")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .phone("03091234570")
                        .avatar("")
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

        // Create lost items with proper images
        List<LostItem> lostItems = createLostItemsWithImages(users);
        log.info("Created {} lost items with images", lostItems.size());

        // Create founders for some lost items with their images
        createFoundersWithImagesForLostItems(lostItems, users);
    }

    private List<LostItem> createLostItemsWithImages(List<User> users) {
        // Create lost items first (without images)
        List<LostItem> lostItems = List.of(
                LostItem.builder()
                        .title("Black iPhone 14 Pro")
                        .description("Black iPhone 14 Pro with cracked screen protector. Has a blue silicone case. Contains important photos and contacts.")
                        .phone("03089999999")
                        .lastLocationDescription("Lost near the main library entrance at TSUE")
                        .lastLocation(LastLocation.builder().lat("41.311081").lng("69.240562").build())
                        .status(Status.LOST)
                        .owner(users.get(1))
                        .lostItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                LostItem.builder()
                        .title("Red Nike Backpack")
                        .description("Red Nike backpack with laptop compartment. Contains MacBook Air, textbooks, and personal items. Very important!")
                        .phone("03089999999")
                        .lastLocationDescription("Left in the cafeteria at NUU during lunch break")
                        .lastLocation(LastLocation.builder().lat("41.298600").lng("69.267700").build())
                        .status(Status.LOST)
                        .owner(users.get(2))
                        .lostItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                LostItem.builder()
                        .title("Silver Car Keys")
                        .description("Silver Toyota car keys with black remote. Has a small Uzbekistan flag keychain attached.")
                        .phone("03089999999")
                        .lastLocationDescription("Dropped somewhere in TUIT parking lot")
                        .lastLocation(LastLocation.builder().lat("41.327094").lng("69.228436").build())
                        .status(Status.LOST)
                        .owner(users.get(3))
                        .lostItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                LostItem.builder()
                        .title("Gold Watch")
                        .description("Gold Casio wristwatch, family heirloom. Has inscription 'To my beloved son' on the back.")
                        .phone("03089999999")
                        .lastLocationDescription("Lost in the sports complex at Westminster University")
                        .lastLocation(LastLocation.builder().lat("41.295800").lng("69.249200").build())
                        .status(Status.LOST)
                        .owner(users.get(0))
                        .lostItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                LostItem.builder()
                        .title("Blue Wallet")
                        .description("Blue leather wallet containing student ID, driver's license, and some cash. Very important documents inside.")
                        .phone("03089555555")
                        .lastLocationDescription("Dropped near the bus stop outside Samarkand State University")
                        .lastLocation(LastLocation.builder().lat("39.627012").lng("66.969604").build())
                        .status(Status.LOST)
                        .owner(users.size() > 4 ? users.get(4) : users.get(1))
                        .lostItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                LostItem.builder()
                        .title("Black Headphones")
                        .description("Sony WH-1000XM4 wireless headphones in black. Expensive noise-canceling headphones, birthday gift from parents.")
                        .phone("03089444444")
                        .lastLocationDescription("Left in study room 203 at TMA library")
                        .lastLocation(LastLocation.builder().lat("41.285350").lng("69.203760").build())
                        .status(Status.LOST)
                        .owner(users.get(2))
                        .lostItemImages(new ArrayList<>()) // Initialize empty list
                        .build()
        );

        // Save lost items first
        List<LostItem> savedLostItems = lostItemRepository.saveAll(lostItems);

        // Now create and save images for each lost item
        for (int i = 0; i < savedLostItems.size(); i++) {
            LostItem lostItem = savedLostItems.get(i);
            List<LostItemImage> images = createImagesForLostItem(lostItem, i);
            lostItemImageRepository.saveAll(images);

            // Update the lost item with the images
            lostItem.setLostItemImages(images);
        }

        return savedLostItems;
    }

    private List<LostItemImage> createImagesForLostItem(LostItem lostItem, int itemIndex) {
        List<String> imageUrls = getLostItemImageUrls(itemIndex);
        List<LostItemImage> images = new ArrayList<>();

        for (int i = 0; i < imageUrls.size(); i++) {
            LostItemImage image = LostItemImage.builder()
                    .imageUri(imageUrls.get(i))
                    .serialNo((long) (i + 1))
                    .lostItem(lostItem)
                    .build();
            images.add(image);
        }

        return images;
    }

    private List<String> getLostItemImageUrls(int itemIndex) {
        // Sample image URLs for different lost items
        return switch (itemIndex) {
            case 0 -> List.of( // iPhone
                    "https://example.com/images/lost/iphone-front.jpg",
                    "https://example.com/images/lost/iphone-back.jpg",
                    "https://example.com/images/lost/iphone-case.jpg"
            );
            case 1 -> List.of( // Backpack
                    "https://example.com/images/lost/nike-backpack-front.jpg",
                    "https://example.com/images/lost/nike-backpack-open.jpg"
            );
            case 2 -> List.of( // Car Keys
                    "https://example.com/images/lost/toyota-keys.jpg",
                    "https://example.com/images/lost/keychain.jpg"
            );
            case 3 -> List.of( // Gold Watch
                    "https://example.com/images/lost/casio-watch-front.jpg",
                    "https://example.com/images/lost/casio-watch-back.jpg"
            );
            case 4 -> List.of( // Blue Wallet
                    "https://example.com/images/lost/blue-wallet-closed.jpg",
                    "https://example.com/images/lost/blue-wallet-open.jpg",
                    "https://example.com/images/lost/wallet-contents.jpg"
            );
            case 5 -> List.of( // Headphones
                    "https://example.com/images/lost/sony-headphones.jpg",
                    "https://example.com/images/lost/headphones-case.jpg"
            );
            default -> List.of("https://example.com/images/lost/default-item.jpg");
        };
    }

    private void createFoundersWithImagesForLostItems(List<LostItem> lostItems, List<User> users) {
        Random random = new Random();

        // Create founders for the first 5 lost items (without images initially)
        List<Founder> founders = List.of(
                Founder.builder()
                        .foundLocationDescription("Found the iPhone near the library stairs, exactly where described")
                        .foundLocation(LastLocation.builder().lat("41.311000").lng("69.240500").build())
                        .foundLostItem(lostItems.get(0))
                        .founder(users.get(random.nextInt(users.size())))
                        .foundItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                Founder.builder()
                        .foundLocationDescription("Saw the red backpack under table 5 in the cafeteria")
                        .foundLocation(LastLocation.builder().lat("41.298650").lng("69.267750").build())
                        .foundLostItem(lostItems.get(1))
                        .founder(users.get(random.nextInt(users.size())))
                        .foundItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                Founder.builder()
                        .foundLocationDescription("Found car keys near the security booth in TUIT parking")
                        .foundLocation(LastLocation.builder().lat("41.327050").lng("69.228400").build())
                        .foundLostItem(lostItems.get(2))
                        .founder(users.get(random.nextInt(users.size())))
                        .foundItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                Founder.builder()
                        .foundLocationDescription("Spotted the gold watch in the locker room after basketball practice")
                        .foundLocation(LastLocation.builder().lat("41.295820").lng("69.249180").build())
                        .foundLostItem(lostItems.get(3))
                        .founder(users.get(random.nextInt(users.size())))
                        .foundItemImages(new ArrayList<>()) // Initialize empty list
                        .build(),

                Founder.builder()
                        .foundLocationDescription("Found the blue wallet near the bus stop, contains ID and cash")
                        .foundLocation(LastLocation.builder().lat("39.627050").lng("66.969650").build())
                        .foundLostItem(lostItems.get(4))
                        .founder(users.get(random.nextInt(users.size())))
                        .foundItemImages(new ArrayList<>()) // Initialize empty list
                        .build()
        );

        // Save founders first
        List<Founder> savedFounders = founderRepository.saveAll(founders);

        // Now create and save images for each founder
        for (int i = 0; i < savedFounders.size(); i++) {
            Founder founder = savedFounders.get(i);
            List<FoundItemImage> foundImages = createImagesForFounder(founder, i);
            foundItemImageRepository.saveAll(foundImages);

            // Update the founder with the images
            founder.setFoundItemImages(foundImages);
        }

        log.info("Created {} founders with images for lost items", savedFounders.size());
    }

    private List<FoundItemImage> createImagesForFounder(Founder founder, int founderIndex) {
        List<String> imageUrls = getFoundItemImageUrls(founderIndex);
        List<FoundItemImage> images = new ArrayList<>();

        for (int i = 0; i < imageUrls.size(); i++) {
            FoundItemImage image = FoundItemImage.builder()
                    .imageUri(imageUrls.get(i))
                    .serialNo((long) (i + 1))
                    .foundItem(founder)
                    .build();
            images.add(image);
        }

        return images;
    }

    private List<String> getFoundItemImageUrls(int founderIndex) {
        // Sample image URLs for different found items (showing the actual found condition)
        return switch (founderIndex) {
            case 0 -> List.of( // iPhone found
                    "https://example.com/images/found/iphone-found-library.jpg",
                    "https://example.com/images/found/iphone-condition.jpg"
            );
            case 1 -> List.of( // Backpack found
                    "https://example.com/images/found/nike-backpack-found-cafeteria.jpg",
                    "https://example.com/images/found/backpack-under-table.jpg",
                    "https://example.com/images/found/backpack-contents-visible.jpg"
            );
            case 2 -> List.of( // Car Keys found
                    "https://example.com/images/found/toyota-keys-found-parking.jpg",
                    "https://example.com/images/found/keys-near-security.jpg"
            );
            case 3 -> List.of( // Gold Watch found
                    "https://example.com/images/found/casio-watch-found-locker.jpg",
                    "https://example.com/images/found/watch-inscription-visible.jpg"
            );
            case 4 -> List.of( // Blue Wallet found
                    "https://example.com/images/found/blue-wallet-found-busstop.jpg",
                    "https://example.com/images/found/wallet-id-visible.jpg",
                    "https://example.com/images/found/wallet-cash-contents.jpg"
            );
            default -> List.of("https://example.com/images/found/default-found-item.jpg");
        };
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