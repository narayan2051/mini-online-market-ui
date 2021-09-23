import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormGroup,
  Checkbox,
  TextField,
  Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";

export default function AddKhakarParikshanAnurodhFaram(props) {
  const { register, handleSubmit, setValue } = useForm();
  const [defaultValue, setDefaultValue] = useState({});

  const [values, setReactSelect] = useState({
    selectedOption: []
  });

  const onSubmit = data => {
    HMIS.post(API_URL.khakarParikshanAnurodh, data)
      .then(response => {
        // TODO: sayal. need to add success method
      })
      .catch(error => {
        // TODO: sayal. need to add success method
      });
  };

  useEffect(() => {
    register({ name: "selectOption" });
  }, []);

  return (
    <Container>
      <Paper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid className="row">
            <Typography gutterBottom variant="h4">
              खकार परिक्षण अनुरोध फाराम
            </Typography>
            <Divider variant="middle" />
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <TextField
                required
                label=" क्षयरोग उपचार केन्द्र"
                type="text"
                margin="normal"
                variant="outlined"
                name="chayarogUpacharKendra"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                label="ओपिडी नं"
                type="text"
                margin="normal"
                variant="outlined"
                name="opdNumber"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                label="क्षयरोगी दर्ता नं  "
                type="text"
                margin="normal"
                variant="outlined"
                name="chayarogDartaaNumber"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                placeholder="मिति"
                margin="normal"
                variant="outlined"
                name="date"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="बिरामीको नाम / थर"
                type="text"
                margin="normal"
                variant="outlined"
                name="biramiKoNaamThar"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="उमेर"
                type="text"
                margin="normal"
                variant="outlined"
                name="age"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="लिङग"
                type="text"
                margin="normal"
                variant="outlined"
                name="gender"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="जिल्ला"
                type="text"
                margin="normal"
                variant="outlined"
                name="district"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="गा. वि. स. र न.पा"
                type="text"
                margin="normal"
                variant="outlined"
                name="palika"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="वडा नं"
                type="text"
                margin="normal"
                variant="outlined"
                name="wardNumber"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="अभिभावकको नाम"
                type="text"
                margin="normal"
                variant="outlined"
                name="abhibhawakKoNaam"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="सम्पर्क नम्बर"
                type="text"
                margin="normal"
                variant="outlined"
                name="samparkaNumber"
                inputRef={register}
              />
            </Grid>
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">परिक्षण गराउनुको कारणः</FormLabel>
                <FormGroup aria-label="forRogNidan" name="forRogNidan">
                  <FormControlLabel
                    value="true"
                    control={<Checkbox color="primary" />}
                    label="रोग निदान"
                    inputRef={register}
                  />
                </FormGroup>
                <RadioGroup aria-label="isRRTBMDR" name="isRRTBMDR">
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="RR TB/MDR हो"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="RR TB/MDR होइन"
                    inputRef={register}
                  />
                </RadioGroup>
                <FormGroup aria-label="forAnugaman" name="forAnugaman" row>
                  <FormControlLabel
                    value="true"
                    control={<Checkbox color="primary" />}
                    label="अनुगमन"
                    inputRef={register}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="महिना"
                type="text"
                margin="normal"
                variant="outlined"
                name="anugamanMahina"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="एचआईभी संक्रमण"
                type="text"
                margin="normal"
                variant="outlined"
                name="hivSankraman"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                placeholder="क्षयरोगको उपचार:"
                type="text"
                margin="normal"
                variant="outlined"
                name="chayarogKoPahilaUpacharVayeNavayeko"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                placeholder="अनुरोध गरिएको परिक्षण:"
                type="text"
                margin="normal"
                variant="outlined"
                name="anurodhGariyekoParikshan"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="अनुरोध गर्ने व्यक्तिको नाम, थर"
                type="text"
                margin="normal"
                variant="outlined"
                name="anurodhGarneByaktiKoNaamThar"
                inputRef={register}
              />
            </Grid>
          </Grid>
          <Grid className="row">
            <Typography gutterBottom variant="h4">
              स्मेयर माईक्रोस्कोपी परिक्षण :
            </Typography>
            <Divider variant="middle" />
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <TextField
                required
                label=" ल्याब सिं नं "
                type="text"
                margin="normal"
                variant="outlined"
                name="smearLabSerialNumber"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                label="नमुना संकलन मिति (ग.म.सा.)"
                type="text"
                margin="normal"
                variant="outlined"
                name="smearNamunaSankalanDate"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                required
                placeholder="नमुना"
                type="text"
                margin="normal"
                variant="outlined"
                name="smearNamuna"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                required
                placeholder="किसिम"
                margin="normal"
                variant="outlined"
                name="smearKisim"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                required
                placeholder="नतिजा"
                margin="normal"
                variant="outlined"
                name="smearNatija"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                placeholder="प्रमाणित गर्ने व्यक्तिको नाम"
                margin="normal"
                variant="outlined"
                name="smearPramanitGarneKoNaam"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                placeholder="नतिजा आएको मिति (ग.म.सा.)"
                margin="normal"
                variant="outlined"
                name="smearNatijAayekoDate"
                inputRef={register}
              />
            </Grid>
          </Grid>
          <Grid className="row">
            <Typography gutterBottom variant="h4">
              जिन एक्सपर्ट परिक्षण नतिजा :
            </Typography>
            <Divider variant="middle" />
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <TextField
                required
                label=" ल्याब सिं नं "
                type="text"
                margin="normal"
                variant="outlined"
                name="geneLabSerialNumber"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                required
                placeholder="खकारमा क्षयरोग ब्याक्टेरिया:"
                type="text"
                margin="normal"
                variant="outlined"
                name="geneKhakarmaChayarogBacteria"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                label="अन्य"
                type="text"
                margin="normal"
                variant="outlined"
                name="geneAnya"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                required
                placeholder="खकारमा ब्याक्टेरिया भएको भए यसको प्रकार"
                margin="normal"
                variant="outlined"
                name="geneKhakarmaBacteriaPrakar"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                placeholder="नतिजा आएको मिति (ग.म.सा.)"
                margin="normal"
                variant="outlined"
                name="geneNatijaAayekoDate"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                placeholder="प्रमाणित गर्ने व्यक्तिको नाम"
                margin="normal"
                variant="outlined"
                name="genePramanitGarneKoNaam"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                placeholder="प्रमाणित गर्ने व्यक्तिको पद"
                margin="normal"
                variant="outlined"
                name="genePramanitGarneKoPaad"
                inputRef={register}
              />
            </Grid>
          </Grid>
          <Grid>
            <Button type="reset" color="secondary" variant="contained">
              रद्द गर्नुहोस
            </Button>
            <Button type="submit" color="primary" variant="contained">
              सुरक्षित गर्नुहोस
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
