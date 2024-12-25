<template>
  <div>
    <iframe :src="reportUrl" width="100%" height="780px" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: "FoodCount",
  data() {
    return {
      // 这里替换为你的帆软报表URL
      reportUrl:
        // "http://10.6.21.1:1532/webroot/decision/view/report?viewlet=dorm%252F%25E5%2585%25A5%25E4%25BD%258F%25E7%258E%2587.cpt&amp;op=view"
        "http://localhost:8075/webroot/decision/view/report?viewlet=%25E6%25A5%25BC%25E6%25A0%258B%25E5%2585%25A5%25E4%25BD%258F%25E7%258E%2587.cpt"
    };
  }
};
</script>
