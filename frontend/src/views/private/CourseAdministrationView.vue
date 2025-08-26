<script setup>
import { ref } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import useUsers from '../../composables/useUsers.js'
import { onMounted } from 'vue'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import { useCourse } from '../../composables/useCourse.js'
import CourseForm from '../../components/entity_edit/CourseForm.vue'
import CourseList from '../../components/entity_edit/CourseList.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import useCourses from '../../composables/useCourses.js'

const selectedCourseId = ref(null)

function fetchCourseId() {
    return selectedCourseId.value
}

const { menu } = usePublicMenu()

const { users: allUsers, fetchAllUsers } = useUsers()
const { courses: paginatedCourses, count: totalCourses, fetchCoursesPaginated } = useCourses()

onMounted(() => {
  fetchCoursesPaginated(1, 10)
  fetchAllUsers()
})

const {
  loading: courseToEditLoading,
  error: courseToEditError,
  course: courseToEdit,
  components: courseToEditComponents,
  updateCourseData: courseToEditUpdate,
  fetchCourseData: courseToEditFetch
} = useCourse(fetchCourseId)

const courseSave = (toSave) => {
  try {
    courseToEditUpdate(toSave)
  } catch (error) {
    console.error('Error saving course data:', error)
  }
}

const onCourseEdit = (id) => {
  selectedCourseId.value = id
  courseToEditFetch()
}

const onCoursePaginate = (page, pageSize) => {
  fetchCoursesPaginated(page, pageSize)
}

const {menu: privateMenu} = usePrivateMenu()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar
        :menuItems="menu"
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="privateMenu"/>

        <section class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 md:flex-nowrap">
                <CourseList 
                  :courses="paginatedCourses"
                  :maxHeight="'28rem'"
                  :totalItems="totalCourses"
                  @edit="onCourseEdit"
                  @paginate="onCoursePaginate"
                />
                <CourseForm 
                  v-if="!courseToEditLoading && !courseToEditError && courseToEdit"
                  :course="courseToEdit"
                  :components="courseToEditComponents"
                  :saving="courseToEditLoading"
                  :componentOptions="allUsers"
                  @save="courseSave"
                />
            </div>
        </section>
      </div>
    </main>

    <Footer/>
  </div>
</template>
