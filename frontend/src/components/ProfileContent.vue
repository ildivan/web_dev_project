<script setup>
defineProps({
  component: Object,
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
  }
})
</script>

<template>
  <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10 pt-16">
    <section class="bg-violet-50 rounded-xl p-8 mb-8 shadow-md">
      <h2 class="text-3xl font-semibold text-violet-700 mb-2">
        {{ component.user.first_name }} {{ component.user.last_name }}
      </h2>
      <p class="text-violet-500 mb-1">@{{ component.user.username }}</p>
      <p class="text-violet-400 mb-1">{{ component.user.email }}</p>
      <div class="mb-2 flex flex-wrap gap-2">
        <span
          v-for="group in component.user.groups"
          :key="group"
          class="bg-violet-200 text-violet-700 rounded px-3 py-1 text-sm"
        >{{ group }}</span>
      </div>
      <p class="mt-4 text-gray-700" v-if="component.description">{{ component.description }}</p>
    </section>

    <section v-if="projects && projects.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Projects</h3>
      <div class="flex flex-wrap gap-4">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>

    <section v-if="ownedProjects && ownedProjects.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Owned Projects</h3>
      <div class="flex flex-wrap gap-4">
        <ProjectCard
          v-for="project in ownedProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>

    <!--
    <section v-if="teachedCourses && teachedCourses.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Teached Courses</h3>
      <div class="flex flex-wrap gap-4">
        <div
        v-for="course in teachedCourses"
        :key="course.id"
        class="bg-violet-100 rounded-lg px-6 py-4 min-w-[120px] text-center shadow"
        >
        <RouterLink
          :to="{ name: 'CourseDetails', params: { id: course.id } }"
          class="text-violet-700 hover:underline"
        >
          Course #{{ course.id }}
        </RouterLink>
        </div>
      </div>
    </section>
    -->

    <section v-if="publications && publications.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Publications</h3>
      <div class="flex flex-wrap gap-4">
        <PublicationCard
          v-for="pub in publications"
          :key="pub.id"
          :publication="pub"
        />
      </div>
    </section>
  </main>
</template>

<script>
import ProjectCard from './/cards/ProjectCard.vue'
import PublicationCard from './cards/PublicationCard.vue'
</script>