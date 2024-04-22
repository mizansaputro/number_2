<script setup lang="ts">
/*import { useQuery } from "@tanstack/vue-query";
import axios from "axios";*/
import { computed, reactive, ref, watchEffect } from "vue";
import IcUpload from "./assets/IcUpload.svg";
import DATA from "./assets/data.json";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

/*const { data } = useQuery({
  queryKey: ["dataJobs"],
  queryFn: async () => {
    const resp = await axios.get(
      "https://bti.id/services/btiportalcorems/api/pt-job-posts/no-auth",
      {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return resp?.data;
  },
});*/
const JOBS_LIST = computed(() => DATA);
const selectedJob = ref(JOBS_LIST?.value?.[0]);

const formInput = reactive({
  name: "",
  mobileNum: "",
  email: "",
  message: "",
  file: "",
});

const { data: dataSubmit, refetch } = useQuery({
  queryKey: ["dataSubmit"],
  queryFn: async () => {
    const resp = await axios.post(
      "https://bti.id/services/btiportalcorems/api/pt-job-applies/no-auth",
      {
        subject: selectedJob?.value?.title,
        displayName: formInput?.name,
        email: formInput?.email,
        phone: formInput?.mobileNum,
        message: formInput?.message,
        ptJobApplyType: "APPLICATION",
        isActive: selectedJob?.value?.isActive,
        ptJobPost: { id: selectedJob?.value?.id },
      }
    );

    return resp?.data;
  },
  enabled: false,
  refetchOnWindowFocus: false,
});

watchEffect(() => {
  console.log(dataSubmit);
});
</script>

<template>
  <div class="flex flex-col gap-8 px-8 py-4">
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="job in JOBS_LIST"
        v-bind:key="job?.id"
        class="col-span-1 bg-red-200 rounded-md shadow-md flex justify-between items-center gap-2 px-4 py-2"
        :class="
          selectedJob?.id === job?.id
            ? 'bg-orange-200 text-gray-400'
            : 'bg-red-200 text-green-600'
        "
      >
        <div>{{ job?.title }}</div>
        <button
          class="bg-orange-400 text-white px-4 py-1 rounded-md shadow-sm text-sm hover:bg-orange-600 active:scale-110"
          @click="
            () => {
              selectedJob = job;
            }
          "
        >
          See Job
        </button>
      </div>
    </div>
    <div class="bg-red-200 rounded-md shadow-md flex flex-col gap-4 px-8 py-4">
      <div class="text-green-600 font-bold text-2xl">
        {{ selectedJob?.title }}
      </div>
      <div
        class="flex flex-col gap-2"
        v-html="selectedJob?.description?.txt"
      ></div>
      <div class="flex flex-col gap-2">
        <h5><strong>Send Your Job Application</strong></h5>
        <div class="grid grid-cols-2 gap-12">
          <div class="form-container">
            <div class="font-semibold">Your Name</div>
            <input
              type="text"
              class="input-container"
              :value="formInput.name"
              @input="
                (e) => {
                  formInput.name = e?.target?.value;
                }
              "
              placeholder="Enter your name"
            />
          </div>
          <div class="form-container">
            <div class="font-semibold">Mobile Number</div>
            <input
              type="text"
              class="input-container"
              :value="formInput.mobileNum"
              @input="
                (e) => {
                  formInput.mobileNum = e?.target?.value;
                }
              "
              placeholder="Enter your mobile number"
            />
          </div>
          <div class="form-container">
            <div class="font-semibold">Email Address</div>
            <input
              type="email"
              class="input-container"
              :value="formInput.email"
              @input="
                (e) => {
                  formInput.email = e?.target?.value;
                }
              "
              placeholder="Enter your email"
            />
          </div>
          <div class="form-container">
            <div class="font-semibold">Write your message here...</div>
            <input
              type="text"
              class="input-container"
              :value="formInput.message"
              @input="
                (e) => {
                  formInput.message = e?.target?.value;
                }
              "
              placeholder="Write your message"
            />
          </div>
          <div class="form-container">
            <div class="font-semibold">File</div>
            <div class="flex items-center gap-2">
              <div>
                <label for="file-upload" class="custom-file-upload">
                  <img :src="IcUpload" alt="ic-upload" class="w-8 h-8" />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  @change="(e) => (formInput.file = e?.target?.value)"
                />
              </div>
              <div class="text-sm">
                {{
                  formInput?.file?.length === 0
                    ? "No Choosen File"
                    : formInput?.file
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <button
            class="bg-orange-400 text-white px-4 py-2 rounded-md shadow-sm text-sm hover:bg-orange-600 active:scale-110 disabled:bg-gray-400 disabled:text-white disabled:hover:scale-100"
            :disabled="
              [
                formInput?.email,
                formInput?.name,
                formInput?.mobileNum,
                formInput?.message,
                formInput?.file,
              ]?.includes('')
            "
            @click="
              () => {
                formInput = {
                  name: '',
                  mobileNum: '',
                  email: '',
                  message: '',
                  file: '',
                };
                refetch();
              }
            "
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
