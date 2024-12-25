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
        // "http://10.6.21.1:1532/webroot/decision/view/report?viewlet=dorm%252F%25E9%2583%25A8%25E9%2597%25A8%25E7%25BB%259F%25E8%25AE%25A1.cpt&amp;op=view"
        "http://localhost:8075/webroot/decision/view/report?viewlet=%25E6%25A5%25BC%25E6%25A0%258B%25E5%2591%2598%25E5%25B7%25A5%25E4%25BF%25A1%25E6%2581%25AF%25E8%25A1%25A8.cpt&op=view"
    };
  }
};
</script>
