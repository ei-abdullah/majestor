
export interface LocationDraft {
    latitude: number;
    longitude: number;
    address: string;
}

export interface PostRideDraft {
    startLocation: LocationDraft | null;
    endLocation: LocationDraft | null;
    vehicleModel: string;
    licensePlate: string;
    phone: string;
    numberOfPassengers: number;
    vehicleType: 'CAR' | 'BIKE';
}

export interface BookRideDraft {
    pickupLocation: LocationDraft | null;
    dropOffLocation: LocationDraft | null;
    phone: string;
    numberOfPassengers: number;
}

export interface CarpoolDraftState {
    postRide: PostRideDraft;
    bookRide: BookRideDraft;
    savePostRide: (draft: Partial<PostRideDraft>) => void;
    saveBookRide: (draft: Partial<BookRideDraft>) => void;
}