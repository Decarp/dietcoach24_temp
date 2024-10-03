import { StyleSheet } from "@react-pdf/renderer";

export const base64Logo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAYAAAB0S6W0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA28SURBVHgB7Z2LldxEFoY/cwhgMuASgYcIKCKAjcAiAkwErY0AbwQ9GwEQgZoIsCOQiMAQwWzfUcujHc/0Q3Xr1arvnOset8dS1dWvuvWuV1SWIi/8POfvJ1a5kFdUXkL25vZ2s7fXh8/bw+cNyxh4FOv7vf11+G44/L3yhCrQERWeYxSifgpp2DEK9cPhc/WiXatAHaMov+exVMwRLWl3e/v98DlQuUpUgG5vv+zt497uC7V+b9tDXipXgGN8oCWLsor1ytDScsN1ivKYWBvS1Z0rZ+D21lGWsELYlirUrGiownzOur39QCUZDWNoK0EsKa0/+KoSiYYqzKVCdVSC4aih3MK21DqqKbK3XylLBCWY9gnnOkBRDD+xru6i2NZT66eLEGo4j2lbatg/m1pqprGeWpoeRailZg6WVd00l9lMjjLCzDCzfxhnGw1Hfv9mZl8dPoUy8vkddfbUAxvyK0W0iqE9B28ZR2MEe24P124ZI0du1ZqPh/yvFi1NtuTzMDQtDWlLt9tDGvTlyEWwG1aIkH40SO/fkvfoitvbHel9pS/MavpMtZRI5XAtld5R5pCfYxRrKpH2rKArSsWZInR1jPWpaygFhHTzEa5apG9II0zH9dIQv2uu5wpF+oYqzJC4vf1JPP9qFLzlSnhDFWYsGuKF/qsQ6RviOKunzh6fo/Vt9UkV6RE04THEqa3yOm3sc4Q4rf6eAuukQvjWuta5HJVTNIQvTYsSqRDeIbXUvAwhfGnaU8Az0QRqQkM5QUtlR2UpWjcNKdKOzAm5NENDulDxRQhbiPxCpmwIl+l3VCwRwnbwvyEztIsnVGZbKqHQFz/EM9OqmJAJQriQ0VAJTUuYZ6eayKLRFGKIrTaG4tISRqTJ66MbwojzasZ5C6IhjEiTjfAJVZzXRkOYZ5ok1PfYZ6aKMz0t9s/1VyKzwT4TDZVcaLF/vtFCvWCf+JZKblh3QfVECvVbME147YTPl47EBdGlGzc0jAK14v3eviE804YJt4fPr578+9+Mh2pNZxPVU+FG1G/WQ8xfE3BDCC2mLYt8IRzqXJ0csaQU0IeiL6KjYr3QsSMQDXaJVHOEwWEbmnpqA856FpQjAD12CWyxxxF2AoTmv2G9WM5U6zBmg13iemzRUP4Lduk7J/3C+lA/W4Z6hyG9YcIEO4Q0GxisdWMty1lrHUY0holqscORfoOtDevDMtQ7DOiNEtNjxxujNFlYtjPIAyHYFQwdnjRGCbnHroERcnJ0Fel5tNj5zuGB1VxPq8kCQr77129YD5aLI7csxBklQE3wJ/SKUQtzrAerSLZ4Ot7WKAFbbLBKT0jrWdd6/Q4bv7VciGWfl+BPjvXOl2xN9VGHjc/+5EIaoxtvsaE3Sk8sc6yHjgQ+s7qp4E9jlJaY1rEeGmx8dva0SzG6odVD6o3SE9uE9WBRHfz43IW/eOY7hw3/xR9HuQ+6YT38B3+03ePO+cUO/7ehx4atQVqepkvH0GV2j+lALet9pZ4tEYyZHqo2zDo+jzZ/8niARMgFiTfY+OxkmLe60RYbeqP0qJ0zuUOM7+kIgz6nDZeHVs1bQxg68PZXf+omVt05gj+WOzQ7zkewE2mIGU8b/Ot8mr8GWxyY+EyO3WRrcIOL+7RewOplWSISwabi/xt2CPbbDG2ww6rv/OjzsnCAValhsezV52VpDe7fY0PI0/ksjzm8M0jPiy+1YJNhq8q4RaOlYTlWJYIvQviutg4bLKLex5AX77GjM0iPb8lgkQZhOUK8fmCLIVqrRrZMF5z3gzr82WGHr7gG/Ne3fyAtG+L1A2vVzOGH+nuHP276YS7Q1/jzO3bkMCso5QYOjvid/Vv8+QN/PlUTv3juSw922OErDguBp3xJNsRH8H8pdvjz7dMvLPocrbqXJjoM6zIJ07BE5LFO6XvOOvywaFx+aihNJajgz3ts+Qt/GpYj2NTLl0SCn0iHwy/fmt8BP6a9tD4J1CK8WzcoLASvD3ppmN7gz9I8hBw3j3F/s3poziXogD/TriOX0mDTQFniE01zaoE6/BjwR+Z/0XpHirrWMaz61NQuKQ21P9hquUvD5Tije/tYjx/OIA3v5hfsPS8WampZh39G506XI/cKsceTcDnOOA0pnqcYpOFhyPPL2QV9sA7vE1qXcdggjCLdHa47HL5XYWof8A/YRoEdy0KdkB6rQRKf63zFLDEmag+AZZiPbQ3LyGUFqy+95/31/z80kgR/BsJgNXQWm4HlL+1Aegb8GfBD9A8VqEVYCzkk+G/KQ9djLfVJyuHViQF/LPqxb77AhoFw7AhXhQjBwDgv0uf/pxapRZ+2RR5urEJ8aH6mnJM3tMQf8MNy0s0Sdvhj8rxKKEGn65cQ6nf4lZ4Td6RjIJ+IJVYCjYF23FqstQ/FsLcfsWFHusbSDhsGDChJoMpbwvW5+vIvbEWVKmJkFalKE6jWa6yFYIGWnNYvzh3xX0aL+rMppQlUGfb2Hfk4UsV5Rxj02rEahwO2h1yYjMpZCTT2zPOBUaQpw70KR88ZvSMcmr+fCc/A6E9LVi1QZWAUSIo60+5w7xgvyB1h8ziQV0Sa8xA9LMZ+G9LiiLM8N+UBXm+xz09PuH7wd/inT/RCzuBCLXnQEE6o6vAUkWKOYJe/0Pm5wz+ND+kTbDKbEw02c0m1xGzJ72CEhuVCVb84wmPh/wfE4EJb8kQYH6Zuo9NzniDVsS1l7DOv1bM7TudNV9y2xM2T7z5fD5OmXx0udo8f2lj4hvyZVgvezGxahTh9lsq0lulpvgbSzGMw1dQ5pctJtVcqBywmmnd6oambyWIXj9zqaZV03OLPoH9MArWY/2eRqMp1YKGFhwnPk0AH/KkCrUxYbET3MAhiKVCLRFWuA7MQPyH4V2p7KhW7lbifYbGbRm0oVRz+Ovq0U+KXswsP+BfNU8dxbty8YMow+72BsvtCc8Dhz6cVoXOB6m4bvgJN2VCaOuE1Da9nPy/pApt33mtl/a/D53vKWbyXim/xZ/fclw1l1UNVfG8Zh1l7bOo9pyzVTKZSsKp/uucuLiEvboAwCkTH1a12n7vEGiqnaPD38/+NSj6tg2r48m3oOOxWBjrGkNGQdv2+zmq/I29eqsoMxON7/Dk6CfwO/zfAd696dfKGfM6Jb8kHYXxZW8aqjfr6HD995PHkY91iUiORw7bXxSq8H61GNUY3cVyOw3Y/0NLFqQ/cMb6s6pdQ1RoV7hb/KNUYpedoQ9vqLXjHeUylZYo65TkPLjbqDy1BOtL5RPOtpazjMjqDe/exbqTOPRY+chbm5CghDuqLhvyix+SHLad9IUb323IGrdHNmheuvyFfYZ5KuyVCGb6YrONlv2yN7vEDZzrOKkNzHPk0fI7ZlrA48iwtz7Wez4XaG1z3oknvncEN1RxhDicI6XwhDIJdSZOLrxrsGkdbLsBqDfa53SC5WEMY9ECxUkJ5KnNcQMmHFyy1HnuEssN5ct+/tPWNjijtWBfW28tohV8jiKNyih0LcJT1FgZ5gxeygSjpvhYTFtID9yuwBjs2ECXN12K/cYQvOY5uub2hbAYe53X+c/h5smmCxQ4btDHUUrmEo6OOrziOPryecpZyqAj/4HFy8UC8CcZCXZd1KcPevsaTlnzDQ8f4BjrSv0Qqzlz9lKs1GKAPPqc+vI6xnzanUr0hH/+UYj2GtMB9Qst1G8QJdXbqB16aNRiSqhTtyL8fUfs7c3jgJVlPAFogVgY6yung3pLXwy/BGgIQoxTtKG/kpSc/AeRsPQGxmkTy1FIeTuDDGucs+NrRJR0WdNgmWMUplImQpwhytS0RcGCe8BJLT0XIUwg5Wk/EgugdmGfAUR5CnmLI0aIWQtMQqGUGNNQHr58YI+QphtysJwGOMBkRykHIUxC5mZCIEKG+pxyRCnkKIidrSUiIUD+JtIRwL+QpilysIwNUSCEyV0KdVMhPFLlYT0aRMFQH/j15d0EJ+QkjF3Nkxh3hMrshT4T8hJGDtWSI1kd9DxA9ZrpxrZAXQn7iSG2/kjFC2MkTPXmJVMhPICmtp4DlQdqwCT3raUMeCPmJJKU4hUJoWIdDhLxEksqKnPATsmU/tw3pEPITSworbYj6Ey1xHNRz5t6Sxgh5CiamNRROSzxnbYkbaoS8xVPFeSYtcR23JY5QBbhfqTVcGS3xnbglrFAFuF+hNVwpLWkc2hHGqQLcr8i0te64chrS7VTSM5aqVq1OgSjpzsF6Cm6tX4pmVDOc2uFLzgOaI4RNY07iFFaGkM+ack3HlrF0v6SUkIhpTGUd5exuaI5mPMSsfF/TKog+mJaxf/Ul0Uom6Q1lLYk5tT9oLFrK2Ch34HHPUTXdEPcnrg/N24+c2P14bQh1G5kcrGOF9c1zyTXkr8VK3UAjOg21NI1pOtF8NV1IVghhl5FUe9wYuOKBUEvTENZR65qmNFShWlhPPf0uGELep47kbKXuwVokQq2fXiLMlhWPBqVEGIXaU5ZoqjBXhlDrqJN1XPF8zWvAsb7wr6XldOJepRCEsSQJudtJDqVlbqfuVRYgjA9SH2gJwjtWUnasSJS5zGaKiTCGQrVvyb+zetjb74xHhqvFOr05C9Yo0Kfczuw1aetx07n2Hw6fv7EyQT6lCvR5VKzCo2hvDn8XbBhm9uHwOZ1vX5lRBXo5k1inOqCc+P1pcvMw+7lyJv8DHpycW6tg60wAAAAASUVORK5CYII=";

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#333333",
    marginBottom: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    color: "#333333",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 13,
    fontWeight: 700,
    color: "gray",
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: "#333333",
    marginBottom: 4,
  },
  textGray: {
    fontSize: 13,
    color: "gray",
    marginBottom: 4,
  },
  separator: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tableCol: {
    width: "50%",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  tableCellHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: "#333333",
  },
  tableCell: {
    fontSize: 11,
    color: "#333333",
  },
  image: {
    width: 80,
    height: 80,
    marginVertical: 5,
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    objectFit: "contain",
    alignSelf: "center",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 10,
    color: "#666666",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLogo: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  footerBrand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 5,
    marginTop: 7,
  },
  footerText: {
    fontSize: 10,
    color: "#666666",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
});
