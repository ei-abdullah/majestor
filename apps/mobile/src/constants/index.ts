import {useAuthStore} from "@/src/stores/authStore";
import React from "react";
import {Filters} from "@/src/services/document.api";
import {useDocument} from "@/src/queries/document.queries";

export const years = [
    {id: '2019', name: '2019'},
    {id: '2020', name: '2020'},
    {id: '2021', name: '2021'},
    {id: '2022', name: '2022'},
    {id: '2023', name: '2023'},
    {id: '2024', name: '2024'},
]

export const type = [
    {id: 'PAST_PAPER', name: 'Past Paper'},
    {id: 'QUIZ', name: 'Quiz'},
    {id: 'NOTES', name: 'Notes'},
    {id: 'ASSIGNMENT', name: 'Assignment'},
    {id: 'PROJECT', name: 'Project'},
    {id: 'REPORT', name: 'Report'},
    {id: 'OTHER', name: 'Other'},
]

export const filterByLike = [
    {id: 'true', name: 'Most'},
    {id: 'false', name: 'Least'}
]