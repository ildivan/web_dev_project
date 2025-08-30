<script setup>
const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  ownedProjects: {
    type: Array,
    default: () => []
  },
  teachedCourses: {
    type: Array,
    default: () => []
  },
  publications: {
    type: Array,
    default: () => []
  },
  allProjects: {
    type: Array,
    default: () => []
  }
})

</script>

<template>
  <main class="flex-grow container max-w-8xl mx-auto  mt-10 ">
    
    <section v-if="ownedProjects && ownedProjects.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Owned Projects</h3>
      <div class="flex flex-wrap gap-4">
        <ProjectCard
          v-for="project in ownedProjects"
          :key="project.id"
          :project="project"
          :clickable="false"
        />
      </div>
    </section>

    <section v-if="projects && projects.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Projects</h3>
      <div class="flex flex-wrap gap-4">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          :clickable="false"
        />
      </div>
    </section>

    <section v-if="teachedCourses && teachedCourses.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Taught Courses</h3>
      <div class="flex flex-wrap gap-4">
        <CourseCard
          v-for="course in teachedCourses"
          :key="course.id"
          :course="course"
          :clickable="false"
        />
      </div>
    </section>

    <section v-if="publications && publications.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Publications</h3>
      <div class="flex flex-wrap gap-4">
        <PublicationCard
          v-for="pub in publications"
          :key="pub.id"
          :publication="pub"
          :projects="props.allProjects"
          :clickable="false"
        />
      </div>
    </section>
  </main>
</template>

<script>
import ProjectCard from './/cards/ProjectCard.vue'
import CourseCard from './cards/CourseCard.vue';
import PublicationCard from './cards/PublicationCard.vue'
</script>